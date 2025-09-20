/**
 * @swagger
 * tags:
 *   name: Entities
 *   description: Entity management "movies and TV shows" 
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Entity:
 *       type: object
 *       required:
 *         - title
 *         - type
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the entity
 *         title:
 *           type: string
 *           description: The title of the movie/TV show
 *         description:
 *           type: string
 *           description: Description of the entity
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: Release date
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date (for TV shows)
 *         type:
 *           type: string
 *           enum: [movie, tv]
 *           description: Type of entity
 *         rating:
 *           type: number
 *           description: Average rating
 *         posterUrl:
 *           type: string
 *           description: URL of the poster image
 *         coverUrl:
 *           type: string
 *           description: URL of the cover image
 *         genres:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *         directors:
 *           type: array
 *           items:
 *             type: string
 *             description: Director ObjectId references
 *         cast:
 *           type: array
 *           items:
 *             type: string
 *             description: Cast member ObjectId references
 *         seasons:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               seasonNumber:
 *                 type: number
 *               description:
 *                 type: string
 *               posterUrl:
 *                 type: string
 *               coverUrl:
 *                 type: string
 *               episodes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     episodeNumber:
 *                       type: number
 *                     description:
 *                       type: string
 *                     releaseDate:
 *                       type: string
 *                       format: date
 *                     duration:
 *                       type: number
 *                     thumbnailUrl:
 *                       type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         title: "Batman"
 *         description: "The Dark Knight returns to Gotham"
 *         releaseDate: "2025-09-20"
 *         type: "movie"
 *         genres: [{"name": "Action", "description": "High-paced"}]
 *         directors: ["650a8b3f4f1234567890abcd"]
 *         cast: ["650a8b3f4f9876543210abcd"]
 *     
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         error:
 *           type: string
 *   
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/entities:
 *   get:
 *     summary: Get all entities with pagination
 *     tags: [Entities]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [movie, tv]
 *         description: Filter by entity type
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
 *         description: Number of entities per page
 *     responses:
 *       200:
 *         description: Entities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 entities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Entity'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/entities/{id}:
 *   get:
 *     summary: Get entity by ID
 *     tags: [Entities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Entity ID
 *     responses:
 *       200:
 *         description: Entity retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 entity:
 *                   $ref: '#/components/schemas/Entity'
 *       400:
 *         description: Invalid entity ID format
 *       404:
 *         description: Entity not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/entities/movie:
 *   post:
 *     summary: Create a new movie
 *     tags: [Entities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 description: Movie title
 *               description:
 *                 type: string
 *                 description: Movie description
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 description: Release date
 *               type:
 *                 type: string
 *                 enum: [movie]
 *                 description: Must be 'movie'
 *               genres:
 *                 type: string
 *                 description: JSON string of genres array
 *                 example: '[{"name":"Action","description":"High-paced"}]'
 *               directors:
 *                 type: string
 *                 description: JSON string of director IDs
 *                 example: '["650a8b3f4f1234567890abcd"]'
 *               cast:
 *                 type: string
 *                 description: JSON string of cast member IDs
 *                 example: '["650a8b3f4f9876543210abcd"]'
 *               posterUrl:
 *                 type: string
 *                 format: binary
 *                 description: Poster image file
 *               coverUrl:
 *                 type: string
 *                 format: binary
 *                 description: Cover image file
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 entity:
 *                   $ref: '#/components/schemas/Entity'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/entities/tv:
 *   post:
 *     summary: Create a new TV show
 *     tags: [Entities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 description: TV show title
 *               description:
 *                 type: string
 *                 description: TV show description
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 description: Release date
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: End date
 *               type:
 *                 type: string
 *                 enum: [tv]
 *                 description: Must be 'tv'
 *               genres:
 *                 type: string
 *                 description: JSON string of genres array
 *                 example: '[{"name":"Drama","description":"Character-driven"}]'
 *               directors:
 *                 type: string
 *                 description: JSON string of director IDs
 *                 example: '["650a8b3f4f1234567890abcd"]'
 *               cast:
 *                 type: string
 *                 description: JSON string of cast member IDs
 *                 example: '["650a8b3f4f9876543210abcd"]'
 *               seasons:
 *                 type: string
 *                 description: JSON string of seasons array
 *                 example: '[{"seasonNumber":1,"description":"First season","episodes":[]}]'
 *               posterUrl:
 *                 type: string
 *                 format: binary
 *                 description: Poster image file
 *               coverUrl:
 *                 type: string
 *                 format: binary
 *                 description: Cover image file
 *     responses:
 *       201:
 *         description: TV show created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/entities/{id}:
 *   patch:
 *     summary: Update entity (partial update)
 *     tags: [Entities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Entity ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Entity title
 *               description:
 *                 type: string
 *                 description: Entity description
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 description: Release date
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: End date
 *               genres:
 *                 type: string
 *                 description: JSON string of genres array
 *               directors:
 *                 type: string
 *                 description: JSON string of director IDs
 *               cast:
 *                 type: string
 *                 description: JSON string of cast member IDs
 *               seasons:
 *                 type: string
 *                 description: JSON string of seasons array (for TV shows)
 *               posterUrl:
 *                 type: string
 *                 format: binary
 *                 description: New poster image file
 *               coverUrl:
 *                 type: string
 *                 format: binary
 *                 description: New cover image file
 *     responses:
 *       200:
 *         description: Entity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 entity:
 *                   $ref: '#/components/schemas/Entity'
 *       400:
 *         description: Invalid entity ID or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Entity not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/entities/{id}:
 *   delete:
 *     summary: Delete entity
 *     tags: [Entities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Entity ID
 *     responses:
 *       200:
 *         description: Entity deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deletedEntity:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     type:
 *                       type: string
 *       400:
 *         description: Invalid entity ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Entity not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/entities/{id}/rating:
 *   get:
 *     summary: Get entity rating (calculates from reviews)
 *     tags: [Entities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Entity ID
 *     responses:
 *       200:
 *         description: Rating retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 rating:
 *                   type: number
 *                   description: Average rating (0-10)
 *                 entityId:
 *                   type: string
 *                 entityTitle:
 *                   type: string
 *       400:
 *         description: Invalid entity ID format
 *       404:
 *         description: Entity not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/entities/filter:
 *   get:
 *     summary: Filter entities (custom filter logic)
 *     tags: [Entities]
 *     responses:
 *       200:
 *         description: Filtered entities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 entities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Entity'
 */

/**
 * @swagger
 * /api/entities/movies/filter:
 *   get:
 *     summary: Filter movies only
 *     tags: [Entities]
 *     responses:
 *       200:
 *         description: Filtered movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 entities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Entity'
 */

/**
 * @swagger
 * /api/entities/tv/filter:
 *   get:
 *     summary: Filter TV shows only
 *     tags: [Entities]
 *     responses:
 *       200:
 *         description: Filtered TV shows
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 entities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Entity'
 */
import express from "express";
import {
  createEntity,
  getAllEntities,
  getEntityById,
  updateEntity,
  deleteEntity,
  getEntityRating,
} from "../controllers/entity.controller.js";
import validateRequest from "../middlewares/validate.js";
import { entityValidation } from "../validations/entity.validation.js";
import { requireAuth, checkRole } from "../auth/auth.middleware.js";
import {
  filterMovies,
  filterTv,
  filterEntities,
} from "../filters/entity.filter.js";
import upload from "../middlewares/upload.js";
import validateFormData from "../validations/validateFormData .js";

const router = express.Router();

/* ---------------------- FILTERS ---------------------- */
router.get("/filter", filterEntities);
router.get("/movies/filter", filterMovies);
router.get("/tv/filter", filterTv);

/* ---------- CRUD ---------- */
router.post(
  "/movie",
  requireAuth,
  checkRole(["admin"]),
  upload.fields([
    { name: "posterUrl", maxCount: 1 },
    { name: "coverUrl", maxCount: 1 },
  ]),
  validateFormData(entityValidation.createMovie),

  createEntity
);

// Add this simple test route temporarily
/* router.post('/test-upload', upload.any(), (req, res) => {
  console.log('Files received:', req.files);
  console.log('Body received:', req.body);
  
  res.json({
    filesReceived: req.files?.length || 0,
    fileNames: req.files?.map(f => f.fieldname) || [],
   // bodyKeys: Object.keys(req.body)
  });
}); */
// Add this middleware BEFORE upload in your route
/* router.post(
  "/movie",
  requireAuth,
  checkRole(["admin"]),

  // Debug middleware - add this BEFORE upload
  (req, res, next) => {
    console.log("🔍 Raw request check:");
    console.log("Content-Type:", req.headers["content-type"]);

    // This will show ALL form fields being sent
    req.on("data", (chunk) => {
      console.log(
        "📦 Raw data chunk received:",
        chunk.toString().substring(0, 200)
      );
    });

    next();
  },

  upload.fields([
    { name: "posterUrl", maxCount: 1 },
    { name: "coverUrl", maxCount: 1 },
  ]),

  // Debug what multer processed
  (req, res, next) => {
    console.log("✅ After multer:");
    console.log("req.files:", req.files);
    console.log("req.body keys:", Object.keys(req.body));
    next();
  },

  createEntity
); */
router.post(
  "/tv",
  requireAuth,
  checkRole(["admin"]),
  upload.fields([
    { name: "posterUrl", maxCount: 1 },
    { name: "coverUrl", maxCount: 1 },
    // You can extend here for season/episode uploads dynamically
  ]),
  /*   validateRequest(entityValidation.createTv), */
  createEntity
);

router.get("/", getAllEntities);
router.get("/:id", getEntityById);

router.patch(
  "/:id",
  requireAuth,
  checkRole(["admin"]),
  upload.fields([
    { name: "posterUrl", maxCount: 1 },
    { name: "coverUrl", maxCount: 1 },
  ]),
  validateFormData(entityValidation.updateEntity),
  updateEntity
);
router.delete("/:id", requireAuth, checkRole(["admin"]), deleteEntity);

/* ---------- RATING ---------- */
router.get("/:id/rating", getEntityRating);

export default router;
