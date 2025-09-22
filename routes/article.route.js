// routes/article.routes.js
import express from "express";
import {
  getAllArticles,
  getArticleById,
  getArticlesByAuthor,
  getArticlesByEntity,
  getUserArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  deleteArticlesByAuthor,
  deleteArticlesByEntity,
} from "../controllers/article.controller.js";
import {
  articleValidation,
  validateArticle,
  validateQuery,
  validateParams,
  requireVerified,
} from "../validations/article.validation.js";
import { requireAuth, checkRole } from "../auth/auth.middleware.js";

const router = express.Router();

/* ---------------------- PUBLIC READ ROUTES ---------------------- */
// Get all articles (public access)
router.get("/", validateQuery(articleValidation.queryParams), getAllArticles);

// Get article by ID (public access)
router.get(
  "/:id",
  validateParams(articleValidation.pathParams),
  getArticleById
);

// Get articles by author (public access)
router.get(
  "/author/:authorId",
  validateParams(articleValidation.authorParams),
  validateQuery(articleValidation.queryParams),
  getArticlesByAuthor
);

// Get articles by entity (public access)
router.get(
  "/entity/:entityId",
  validateParams(articleValidation.entityParams),
  validateQuery(articleValidation.queryParams),
  getArticlesByEntity
);

/* ---------------------- USER ROUTES (Authenticated) ---------------------- */
// Get current user's own articles
router.get(
  "/my/articles",
  requireAuth,
  validateQuery(articleValidation.queryParams),
  getUserArticles
);

// Create article (verified users only)
router.post(
  "/",
  requireAuth,
  requireVerified,
  validateArticle(articleValidation.createArticle),
  createArticle
);

// Update article (author only)
router.patch(
  "/:id",
  requireAuth,
  validateParams(articleValidation.pathParams),
  validateArticle(articleValidation.updateArticle),
  updateArticle
);

// Delete article (author or admin)
router.delete(
  "/:id",
  requireAuth,
  validateParams(articleValidation.pathParams),
  deleteArticle
);

/* ---------------------- ADMIN ROUTES (Admin Only) ---------------------- */
// Bulk delete articles by author (admin only)
router.delete(
  "/admin/author/:authorId",
  requireAuth,
  checkRole(["admin"]),
  validateParams(articleValidation.authorParams),
  deleteArticlesByAuthor
);

// Bulk delete articles by entity (admin only)
router.delete(
  "/admin/entity/:entityId",
  requireAuth,
  checkRole(["admin"]),
  validateParams(articleValidation.entityParams),
  deleteArticlesByEntity
);

export default router;
/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Article management operations
 */

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Get all articles with pagination and filters (Public)
 *     tags: [Articles]
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
 *           maximum: 50
 *           default: 10
 *         description: Number of articles per page
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Filter by author ID
 *       - in: query
 *         name: entity
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Filter by related entity ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Search by article title or content
 *     responses:
 *       200:
 *         description: Articles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArticleList'
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
 * /api/articles/{id}:
 *   get:
 *     summary: Get article by ID (Public)
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 article:
 *                   $ref: '#/components/schemas/ArticleDetailed'
 *       400:
 *         description: Invalid article ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Article not found
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
 * /api/articles/author/{authorId}:
 *   get:
 *     summary: Get all articles by a specific author (Public)
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Author ID
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
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Articles by author retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArticlesByAuthor'
 *       400:
 *         description: Invalid author ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Author not found
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
 * /api/articles/entity/{entityId}:
 *   get:
 *     summary: Get all articles related to a specific entity (Public)
 *     tags: [Articles]
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
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Articles by entity retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArticlesByEntity'
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
 * /api/articles/my/articles:
 *   get:
 *     summary: Get current user's articles
 *     tags: [Articles]
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
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: User articles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
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
 * /api/articles:
 *   post:
 *     summary: Create a new article (Verified users only)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateArticle'
 *     responses:
 *       201:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArticleResponse'
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
 *         description: Only verified users can create articles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Related entity not found
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
 * /api/articles/{id}:
 *   patch:
 *     summary: Update article (Author only)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateArticle'
 *     responses:
 *       200:
 *         description: Article updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArticleResponse'
 *       400:
 *         description: Invalid article ID or validation error
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
 *         description: You can only update your own articles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Article or related entity not found
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
 * /api/articles/{id}:
 *   delete:
 *     summary: Delete article (Author or Admin)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article deleted successfully
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
 *                   example: "Article deleted successfully"
 *                 deletedArticle:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "650a8b3f4f1234567890abcd"
 *                     title:
 *                       type: string
 *                       example: "The Evolution of Batman in Cinema"
 *                     author:
 *                       type: string
 *                       example: "650a8b3f4f1234567890abcd"
 *       400:
 *         description: Invalid article ID format
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
 *         description: You can only delete your own articles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Article not found
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
 * /api/articles/admin/author/{authorId}:
 *   delete:
 *     summary: Delete all articles by author (Admin only)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Articles deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BulkDeleteResponse'
 *       400:
 *         description: Invalid author ID format
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
 * /api/articles/admin/entity/{entityId}:
 *   delete:
 *     summary: Delete all articles related to entity (Admin only)
 *     tags: [Articles]
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
 *         description: Articles deleted successfully
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
 *     Article:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the article
 *           example: "650a8b3f4f1234567890abcd"
 *         title:
 *           type: string
 *           description: Article title
 *           example: "The Evolution of Batman in Cinema"
 *         content:
 *           type: string
 *           description: Article content
 *           example: "Batman has undergone numerous transformations throughout cinema history..."
 *         author:
 *           type: object
 *           description: The author of the article
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abcd"
 *             username:
 *               type: string
 *               example: "moviebuff2023"
 *             avatar:
 *               type: string
 *               example: "https://example.com/avatar.jpg"
 *             verified:
 *               type: boolean
 *               example: true
 *         relatedEntity:
 *           type: object
 *           nullable: true
 *           description: The movie/TV show this article is about
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
 *     ArticleDetailed:
 *       type: object
 *       description: Article with full author and entity details
 *       properties:
 *         _id:
 *           type: string
 *           example: "650a8b3f4f1234567890abcd"
 *         title:
 *           type: string
 *           example: "The Evolution of Batman in Cinema"
 *         content:
 *           type: string
 *           example: "Batman has undergone numerous transformations throughout cinema history..."
 *         author:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abcd"
 *             username:
 *               type: string
 *               example: "moviebuff2023"
 *             avatar:
 *               type: string
 *               example: "https://example.com/avatar.jpg"
 *             bio:
 *               type: string
 *               example: "Movie enthusiast and critic"
 *             verified:
 *               type: boolean
 *               example: true
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: "2023-01-15T08:00:00.000Z"
 *         relatedEntity:
 *           type: object
 *           nullable: true
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
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-09-20T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-09-20T10:30:00.000Z"
 *
 *     CreateArticle:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           minLength: 5
 *           maxLength: 200
 *           description: Article title
 *           example: "The Evolution of Batman in Cinema"
 *         content:
 *           type: string
 *           minLength: 50
 *           maxLength: 50000
 *           description: Article content (minimum 50 characters)
 *           example: "Batman has undergone numerous transformations throughout cinema history, from the campy 1960s TV series to the dark and gritty modern interpretations. This evolution reflects not only changing audience tastes but also the broader cultural shifts in how we view heroism and justice..."
 *         relatedEntity:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           nullable: true
 *           description: Related movie/TV show ObjectId (optional)
 *           example: "650a8b3f4f1234567890abce"
 *
 *     UpdateArticle:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         title:
 *           type: string
 *           minLength: 5
 *           maxLength: 200
 *           description: Article title
 *           example: "The Complete Evolution of Batman in Modern Cinema"
 *         content:
 *           type: string
 *           minLength: 50
 *           maxLength: 50000
 *           description: Article content
 *           example: "Batman has undergone numerous transformations throughout cinema history, with each iteration reflecting the zeitgeist of its era..."
 *         relatedEntity:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           nullable: true
 *           description: Related movie/TV show ObjectId (can be null to remove relation)
 *           example: "650a8b3f4f1234567890abce"
 *
 *     ArticleList:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         articles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Article'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     ArticlesByAuthor:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         author:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abcd"
 *             username:
 *               type: string
 *               example: "moviebuff2023"
 *             avatar:
 *               type: string
 *               example: "https://example.com/avatar.jpg"
 *             verified:
 *               type: boolean
 *               example: true
 *         articles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Article'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     ArticlesByEntity:
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
 *         articles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Article'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     ArticleResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Article created successfully"
 *         article:
 *           $ref: '#/components/schemas/Article'
 *
 *     BulkDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "5 articles deleted successfully"
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
 *                 example: "title"
 *               message:
 *                 type: string
 *                 example: "Title is required"
 */
