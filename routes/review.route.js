// routes/review.routes.js
import express from "express";
import {
  getAllReviews,
  getReviewById,
  getReviewsByEntity,
  getReviewsByUser,
  getUserOwnReviews,
  getUserReviewForEntity,
  createReview,
  updateReview,
  deleteReview,
  deleteReviewsByUser,
  deleteReviewsByEntity,
  getReviewStats
} from "../controllers/review.controller.js";
import {
  reviewValidation,
  validateReview,
  validateQuery,
  validateParams,
  checkExistingReview,
  validateRatingRange
} from "../validations/review.validations.js";
import { requireAuth, checkRole } from "../auth/auth.middleware.js";

const router = express.Router();

/* ---------------------- PUBLIC READ ROUTES ---------------------- */
// Get all reviews (public access)
router.get(
  "/",
  validateQuery(reviewValidation.queryParams),
  validateRatingRange,
  getAllReviews
);

// Get review by ID (public access)
router.get(
  "/:id",
  validateParams(reviewValidation.pathParams),
  getReviewById
);

// Get reviews by entity with stats (public access)
router.get(
  "/entity/:entityId",
  validateParams(reviewValidation.entityParams),
  validateQuery(reviewValidation.queryParams),
  validateRatingRange,
  getReviewsByEntity
);

// Get reviews by user (public access)
router.get(
  "/user/:userId",
  validateParams(reviewValidation.userParams),
  validateQuery(reviewValidation.queryParams),
  getReviewsByUser
);

// Get review statistics for entity (public access)
router.get(
  "/stats/:entityId",
  validateParams(reviewValidation.entityParams),
  getReviewStats
);

/* ---------------------- USER ROUTES (Authenticated) ---------------------- */
// Get current user's own reviews
router.get(
  "/my/reviews",
  requireAuth,
  validateQuery(reviewValidation.queryParams),
  getUserOwnReviews
);

// Check if user has reviewed a specific entity
router.get(
  "/my/entity/:entityId",
  requireAuth,
  validateParams(reviewValidation.entityParams),
  getUserReviewForEntity
);

// Create review (authenticated users only)
router.post(
  "/",
  requireAuth,
  validateReview(reviewValidation.createReview),
  checkExistingReview,
  createReview
);

// Update review (author only)
router.patch(
  "/:id",
  requireAuth,
  validateParams(reviewValidation.pathParams),
  validateReview(reviewValidation.updateReview),
  updateReview
);

// Delete review (author or admin)
router.delete(
  "/:id",
  requireAuth,
  validateParams(reviewValidation.pathParams),
  deleteReview
);

/* ---------------------- ADMIN ROUTES (Admin Only) ---------------------- */
// Bulk delete reviews by user (admin only)
router.delete(
  "/admin/user/:userId",
  requireAuth,
  checkRole(["admin"]),
  validateParams(reviewValidation.userParams),
  deleteReviewsByUser
);

// Bulk delete reviews by entity (admin only)
router.delete(
  "/admin/entity/:entityId",
  requireAuth,
  checkRole(["admin"]),
  validateParams(reviewValidation.entityParams),
  deleteReviewsByEntity
);

export default router;
/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management operations
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews with pagination and filters (Public)
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of reviews per page
 *       - in: query
 *         name: entity
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Filter by entity ID
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Filter by user ID
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         description: Minimum rating filter
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         description: Maximum rating filter
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Search by comment content
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewList'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get review by ID (Public)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 review:
 *                   $ref: '#/components/schemas/ReviewDetailed'
 *       400:
 *         description: Invalid review ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/reviews/entity/{entityId}:
 *   get:
 *     summary: Get all reviews for a specific entity with statistics (Public)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Entity ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *     responses:
 *       200:
 *         description: Entity reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewsByEntity'
 *       400:
 *         description: Invalid entity ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Entity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/reviews/user/{userId}:
 *   get:
 *     summary: Get all reviews by a specific user (Public)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: User reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewsByUser'
 *       400:
 *         description: Invalid user ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/reviews/stats/{entityId}:
 *   get:
 *     summary: Get review statistics for an entity (Public)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Entity ID
 *     responses:
 *       200:
 *         description: Review statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewStats'
 *       400:
 *         description: Invalid entity ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Entity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/reviews/my/reviews:
 *   get:
 *     summary: Get current user's own reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: User's reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/reviews/my/entity/{entityId}:
 *   get:
 *     summary: Check if user has reviewed a specific entity
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Entity ID
 *     responses:
 *       200:
 *         description: Review status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 review:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Review'
 *                     - type: "null"
 *                 hasReviewed:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid entity ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review (Authenticated users only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReview'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Entity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: User has already reviewed this entity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "You have already reviewed this entity"
 *                 error:
 *                   type: string
 *                   example: "Duplicate review not allowed"
 *                 existingReview:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     rating:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   patch:
 *     summary: Update review (Author only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReview'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResponse'
 *       400:
 *         description: Invalid review ID or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: You can only update your own reviews
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete review (Author or Admin)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Review deleted successfully"
 *                 deletedReview:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "650a8b3f4f1234567890abcd"
 *                     rating:
 *                       type: integer
 *                       example: 8
 *                     entity:
 *                       type: string
 *                       example: "650a8b3f4f1234567890abce"
 *       400:
 *         description: Invalid review ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: You can only delete your own reviews
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/reviews/admin/user/{userId}:
 *   delete:
 *     summary: Delete all reviews by user (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: User ID
 *     responses:
 *       200:
 *         description: Reviews deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BulkDeleteResponse'
 *       400:
 *         description: Invalid user ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/reviews/admin/entity/{entityId}:
 *   delete:
 *     summary: Delete all reviews for entity (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Entity ID
 *     responses:
 *       200:
 *         description: Reviews deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BulkDeleteResponse'
 *       400:
 *         description: Invalid entity ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - user
 *         - entity
 *         - rating
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the review
 *           example: "650a8b3f4f1234567890abcd"
 *         user:
 *           type: object
 *           description: The user who wrote the review
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abcd"
 *             username:
 *               type: string
 *               example: "moviefan123"
 *             avatar:
 *               type: string
 *               example: "https://example.com/avatar.jpg"
 *         entity:
 *           type: object
 *           description: The movie/TV show being reviewed
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abce"
 *             title:
 *               type: string
 *               example: "Batman Begins"
 *             type:
 *               type: string
 *               example: "movie"
 *             posterUrl:
 *               type: string
 *               example: "https://example.com/batman-begins-poster.jpg"
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           description: User's rating (1-10)
 *           example: 8
 *         comment:
 *           type: string
 *           maxLength: 1000
 *           description: User's review comment
 *           example: "Excellent movie with great character development and stunning visuals."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           example: "2023-09-20T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           example: "2023-09-20T10:30:00.000Z"
 *
 *     ReviewDetailed:
 *       type: object
 *       description: Review with full user and entity details
 *       properties:
 *         _id:
 *           type: string
 *           example: "650a8b3f4f1234567890abcd"
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abcd"
 *             username:
 *               type: string
 *               example: "moviefan123"
 *             avatar:
 *               type: string
 *               example: "https://example.com/avatar.jpg"
 *             bio:
 *               type: string
 *               example: "Movie enthusiast and critic"
 *         entity:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abce"
 *             title:
 *               type: string
 *               example: "Batman Begins"
 *             type:
 *               type: string
 *               example: "movie"
 *             description:
 *               type: string
 *               example: "After training with his mentor, Batman begins his fight to free crime-ridden Gotham City"
 *             posterUrl:
 *               type: string
 *               example: "https://example.com/batman-begins-poster.jpg"
 *             coverUrl:
 *               type: string
 *               example: "https://example.com/batman-begins-cover.jpg"
 *             rating:
 *               type: number
 *               example: 8.2
 *         rating:
 *           type: integer
 *           example: 8
 *         comment:
 *           type: string
 *           example: "Excellent movie with great character development and stunning visuals."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-09-20T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-09-20T10:30:00.000Z"
 *
 *     CreateReview:
 *       type: object
 *       required:
 *         - entity
 *         - rating
 *       properties:
 *         entity:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           description: Entity ObjectId
 *           example: "650a8b3f4f1234567890abce"
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           description: Rating from 1 to 10
 *           example: 8
 *         comment:
 *           type: string
 *           maxLength: 1000
 *           description: Optional review comment
 *           example: "Excellent movie with great character development and stunning visuals."
 *
 *     UpdateReview:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           description: Updated rating from 1 to 10
 *           example: 9
 *         comment:
 *           type: string
 *           maxLength: 1000
 *           description: Updated review comment
 *           example: "After rewatching, I appreciate it even more. The cinematography is outstanding."
 *
 *     ReviewList:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     ReviewsByEntity:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         entity:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abce"
 *             title:
 *               type: string
 *               example: "Batman Begins"
 *             type:
 *               type: string
 *               example: "movie"
 *             posterUrl:
 *               type: string
 *               example: "https://example.com/batman-begins-poster.jpg"
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *         stats:
 *           type: object
 *           properties:
 *             averageRating:
 *               type: number
 *               example: 8.2
 *             totalReviews:
 *               type: integer
 *               example: 150
 *
 *     ReviewsByUser:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abcd"
 *             username:
 *               type: string
 *               example: "moviefan123"
 *             avatar:
 *               type: string
 *               example: "https://example.com/avatar.jpg"
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     ReviewStats:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         entity:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abce"
 *             title:
 *               type: string
 *               example: "Batman Begins"
 *             type:
 *               type: string
 *               example: "movie"
 *         stats:
 *           type: object
 *           properties:
 *             averageRating:
 *               type: number
 *               example: 8.2
 *               description: Average rating of all reviews
 *             totalReviews:
 *               type: integer
 *               example: 150
 *               description: Total number of reviews
 *             ratingDistribution:
 *               type: object
 *               description: Count of reviews by rating
 *               example:
 *                 "10": 25
 *                 "9": 30
 *                 "8": 40
 *                 "7": 25
 *                 "6": 15
 *                 "5": 10
 *                 "4": 3
 *                 "3": 1
 *                 "2": 1
 *                 "1": 0
 *
 *     ReviewResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Review created successfully"
 *         review:
 *           $ref: '#/components/schemas/Review'
 *
 *     BulkDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "15 reviews deleted successfully"
 *         deletedCount:
 *           type: integer
 *           example: 15
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total number of items
 *           example: 150
 *         page:
 *           type: integer
 *           description: Current page number
 *           example: 1
 *         limit:
 *           type: integer
 *           description: Items per page
 *           example: 10
 *         pages:
 *           type: integer
 *           description: Total number of pages
 *           example: 15
 *
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error message"
 *         error:
 *           type: string
 *           example: "Detailed error information"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "rating"
 *               message:
 *                 type: string
 *                 example: "Rating must be between 1 and 10"
 */