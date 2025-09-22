// routes/award.routes.js
import express from "express";
import {
  getAllAwards,
  getAwardById,
  getAwardsByEntity,
  getAwardsByPerson,
  getAwardsByYear,
  getAwardCategories,
  createAward,
  updateAward,
  deleteAward,
  createMultipleAwards,
  deleteAwardsByEntity,
  deleteAwardsByPerson
} from "../controllers/award.controller.js";
import {
  awardValidation,
  validateAward,
  validateQuery,
  validateParams,
  validateYear
} from "../validations/award.validation.js";
import { requireAuth, checkRole } from "../auth/auth.middleware.js";

const router = express.Router();

/* ---------------------- PUBLIC READ ROUTES ---------------------- */
// Get all awards (public access)
router.get(
  "/",
  validateQuery(awardValidation.queryParams),
  getAllAwards
);

// Get award categories with counts (public access)
router.get(
  "/categories",
  getAwardCategories
);

// Get award by ID (public access)
router.get(
  "/:id",
  validateParams(awardValidation.pathParams),
  getAwardById
);

// Get awards by entity (public access)
router.get(
  "/entity/:entityId",
  validateParams(awardValidation.entityParams),
  validateQuery(awardValidation.queryParams),
  getAwardsByEntity
);

// Get awards by person (public access)
router.get(
  "/person/:personId",
  validateParams(awardValidation.personParams),
  validateQuery(awardValidation.queryParams),
  getAwardsByPerson
);

// Get awards by year (public access)
router.get(
  "/year/:year",
  validateYear,
  validateQuery(awardValidation.queryParams),
  getAwardsByYear
);

/* ---------------------- ADMIN ROUTES (Admin Only) ---------------------- */
// Create award (admin only)
router.post(
  "/",
  requireAuth,
  checkRole(["admin"]),
  validateAward(awardValidation.createAward),
  createAward
);

// Create multiple awards (admin only)
router.post(
  "/bulk",
  requireAuth,
  checkRole(["admin"]),
  validateAward(awardValidation.createMultipleAwards),
  createMultipleAwards
);

// Update award (admin only)
router.patch(
  "/:id",
  requireAuth,
  checkRole(["admin"]),
  validateParams(awardValidation.pathParams),
  validateAward(awardValidation.updateAward),
  updateAward
);

// Delete award (admin only)
router.delete(
  "/:id",
  requireAuth,
  checkRole(["admin"]),
  validateParams(awardValidation.pathParams),
  deleteAward
);

// Bulk delete awards by entity (admin only)
router.delete(
  "/entity/:entityId",
  requireAuth,
  checkRole(["admin"]),
  validateParams(awardValidation.entityParams),
  deleteAwardsByEntity
);

// Bulk delete awards by person (admin only)
router.delete(
  "/person/:personId",
  requireAuth,
  checkRole(["admin"]),
  validateParams(awardValidation.personParams),
  deleteAwardsByPerson
);

export default router;
/**
 * @swagger
 * tags:
 *   name: Awards
 *   description: Award management operations
 */

/**
 * @swagger
 * /api/awards:
 *   get:
 *     summary: Get all awards with pagination and filters (Public)
 *     tags: [Awards]
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
 *         description: Number of awards per page
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 1900
 *         description: Filter by year
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Filter by category
 *       - in: query
 *         name: entity
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Filter by entity ID
 *       - in: query
 *         name: person
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Filter by person ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Search by award name or category
 *     responses:
 *       200:
 *         description: Awards retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AwardList'
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
 * /api/awards/{id}:
 *   get:
 *     summary: Get award by ID (Public)
 *     tags: [Awards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Award ID
 *     responses:
 *       200:
 *         description: Award retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 award:
 *                   $ref: '#/components/schemas/AwardDetailed'
 *       400:
 *         description: Invalid award ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Award not found
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
 * /api/awards/entity/{entityId}:
 *   get:
 *     summary: Get all awards by a specific entity (Public)
 *     tags: [Awards]
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
 *     responses:
 *       200:
 *         description: Awards by entity retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AwardsByEntity'
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
 * /api/awards/person/{personId}:
 *   get:
 *     summary: Get all awards by a specific person (Public)
 *     tags: [Awards]
 *     parameters:
 *       - in: path
 *         name: personId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Person ID
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
 *         description: Awards by person retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AwardsByPerson'
 *       400:
 *         description: Invalid person ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Person not found
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
 * /api/awards/year/{year}:
 *   get:
 *     summary: Get all awards by year (Public)
 *     tags: [Awards]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1900
 *         description: Award year
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
 *         name: category
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Awards by year retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AwardsByYear'
 *       400:
 *         description: Invalid year
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
 * /api/awards/categories:
 *   get:
 *     summary: Get award categories with counts (Public)
 *     tags: [Awards]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AwardCategories'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/awards:
 *   post:
 *     summary: Create a new award (Admin only)
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAward'
 *     responses:
 *       201:
 *         description: Award created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AwardResponse'
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
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Related entity or person not found
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
 * /api/awards/bulk:
 *   post:
 *     summary: Create multiple awards (Admin only)
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMultipleAwards'
 *     responses:
 *       201:
 *         description: Awards created successfully
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
 *                   example: "5 awards created successfully"
 *                 awards:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Award'
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
 * /api/awards/{id}:
 *   patch:
 *     summary: Update award (Admin only)
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Award ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAward'
 *     responses:
 *       200:
 *         description: Award updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AwardResponse'
 *       400:
 *         description: Invalid award ID or validation error
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
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Award, entity, or person not found
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
 * /api/awards/{id}:
 *   delete:
 *     summary: Delete award (Admin only)
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Award ID
 *     responses:
 *       200:
 *         description: Award deleted successfully
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
 *                   example: "Award deleted successfully"
 *                 deletedAward:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "650a8b3f4f1234567890abcd"
 *                     name:
 *                       type: string
 *                       example: "Best Picture"
 *                     category:
 *                       type: string
 *                       example: "Academy Awards"
 *                     year:
 *                       type: integer
 *                       example: 2023
 *       400:
 *         description: Invalid award ID format
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
 *       404:
 *         description: Award not found
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
 * /api/awards/entity/{entityId}:
 *   delete:
 *     summary: Delete all awards by entity (Admin only)
 *     tags: [Awards]
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
 *         description: Awards deleted successfully
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
 * /api/awards/person/{personId}:
 *   delete:
 *     summary: Delete all awards by person (Admin only)
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: personId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Person ID
 *     responses:
 *       200:
 *         description: Awards deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BulkDeleteResponse'
 *       400:
 *         description: Invalid person ID format
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
 *     Award:
 *       type: object
 *       required:
 *         - name
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the award
 *           example: "650a8b3f4f1234567890abcd"
 *         name:
 *           type: string
 *           description: Award name
 *           example: "Best Picture"
 *         category:
 *           type: string
 *           description: Award category
 *           example: "Academy Awards"
 *         year:
 *           type: integer
 *           description: Award year
 *           example: 2023
 *         entity:
 *           type: object
 *           nullable: true
 *           description: The entity this award is for
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abce"
 *             title:
 *               type: string
 *               example: "Oppenheimer"
 *             type:
 *               type: string
 *               example: "movie"
 *             posterUrl:
 *               type: string
 *               example: "https://example.com/oppenheimer-poster.jpg"
 *         person:
 *           type: object
 *           nullable: true
 *           description: The person this award is for
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abcf"
 *             name:
 *               type: string
 *               example: "Christopher Nolan"
 *             photoUrl:
 *               type: string
 *               example: "https://example.com/nolan-photo.jpg"
 *             roles:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["director", "producer"]
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
 *     AwardDetailed:
 *       type: object
 *       description: Award with full entity and person details
 *       properties:
 *         _id:
 *           type: string
 *           example: "650a8b3f4f1234567890abcd"
 *         name:
 *           type: string
 *           example: "Best Picture"
 *         category:
 *           type: string
 *           example: "Academy Awards"
 *         year:
 *           type: integer
 *           example: 2023
 *         entity:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abce"
 *             title:
 *               type: string
 *               example: "Oppenheimer"
 *             type:
 *               type: string
 *               example: "movie"
 *             description:
 *               type: string
 *               example: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb."
 *             posterUrl:
 *               type: string
 *               example: "https://example.com/oppenheimer-poster.jpg"
 *             coverUrl:
 *               type: string
 *               example: "https://example.com/oppenheimer-cover.jpg"
 *             rating:
 *               type: number
 *               example: 8.5
 *         person:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abcf"
 *             name:
 *               type: string
 *               example: "Christopher Nolan"
 *             bio:
 *               type: string
 *               example: "British-American film director, producer, and screenwriter"
 *             photoUrl:
 *               type: string
 *               example: "https://example.com/nolan-photo.jpg"
 *             dateOfBirth:
 *               type: string
 *               format: date
 *               example: "1970-07-30"
 *             roles:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["director", "producer"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-09-20T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-09-20T10:30:00.000Z"
 *
 *     CreateAward:
 *       type: object
 *       required:
 *         - name
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 200
 *           description: Award name
 *           example: "Best Picture"
 *         category:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Award category
 *           example: "Academy Awards"
 *         year:
 *           type: integer
 *           minimum: 1900
 *           description: Award year (optional)
 *           example: 2023
 *         entity:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           nullable: true
 *           description: Related entity ObjectId (optional, but at least one of entity or person required)
 *           example: "650a8b3f4f1234567890abce"
 *         person:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           nullable: true
 *           description: Related person ObjectId (optional, but at least one of entity or person required)
 *           example: "650a8b3f4f1234567890abcf"
 *
 *     UpdateAward:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 200
 *           description: Award name
 *           example: "Best Motion Picture"
 *         category:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Award category
 *           example: "Oscars"
 *         year:
 *           type: integer
 *           minimum: 1900
 *           description: Award year
 *           example: 2023
 *         entity:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           nullable: true
 *           description: Related entity ObjectId (can be null to remove)
 *           example: "650a8b3f4f1234567890abce"
 *         person:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           nullable: true
 *           description: Related person ObjectId (can be null to remove)
 *           example: "650a8b3f4f1234567890abcf"
 *
 *     CreateMultipleAwards:
 *       type: object
 *       required:
 *         - awards
 *       properties:
 *         awards:
 *           type: array
 *           minItems: 1
 *           maxItems: 100
 *           items:
 *             $ref: '#/components/schemas/CreateAward'
 *
 *     AwardList:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         awards:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Award'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     AwardsByEntity:
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
 *               example: "Oppenheimer"
 *             type:
 *               type: string
 *               example: "movie"
 *             posterUrl:
 *               type: string
 *               example: "https://example.com/oppenheimer-poster.jpg"
 *         awards:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Award'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     AwardsByPerson:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         person:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abcf"
 *             name:
 *               type: string
 *               example: "Christopher Nolan"
 *             photoUrl:
 *               type: string
 *               example: "https://example.com/nolan-photo.jpg"
 *             roles:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["director", "producer"]
 *         awards:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Award'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     AwardsByYear:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         year:
 *           type: integer
 *           example: 2023
 *         awards:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Award'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     AwardCategories:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         categories:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Academy Awards"
 *               count:
 *                 type: integer
 *                 example: 50
 *
 *     AwardResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Award created successfully"
 *         award:
 *           $ref: '#/components/schemas/Award'
 *
 *     BulkDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "5 awards deleted successfully"
 *         deletedCount:
 *           type: integer
 *           example: 5
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total number of items
 *           example: 100
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
 *           example: 10
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
 *                 example: "name"
 *               message:
 *                 type: string
 *                 example: "Name is required"
 */