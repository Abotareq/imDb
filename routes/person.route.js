// routes/person.routes.js
import express from "express";
import {
  getAllPeople,
  getPersonById,
  getPersonEntities,
  getPersonsByRole,
  createPerson,
  updatePerson,
  deletePerson,
  getPersonStats,
} from "../controllers/person.controller.js";
import {
  personValidation,
  validatePersonFormData,
  validatePerson,
  validateQuery,
  validateParams,
} from "../validations/person.validations.js";
import { requireAuth, checkRole } from "../auth/auth.middleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

/* ---------------------- READ ROUTES ---------------------- */

router.get("/", validateQuery(personValidation.queryParams), getAllPeople);

router.get(
  "/role/:role",
  validateParams(personValidation.getPersonsByRole),
  validateQuery(personValidation.queryParams),
  getPersonsByRole
);

router.get("/:id", getPersonById);

router.get(
  "/:id/movies",
  validateQuery(personValidation.queryParams),
  getPersonEntities
);

router.get("/:id/stats", getPersonStats);

/* ---------------------- CREATE ROUTES ---------------------- */

router.post(
  "/",
  requireAuth,
  checkRole(["admin"]),
  upload.single("photoUrl"), // Single file upload for photo
  validatePersonFormData(personValidation.createPerson),
  createPerson
);

/* ---------------------- UPDATE ROUTES ---------------------- */

router.patch(
  "/:id",
  requireAuth,
  checkRole(["admin"]),
  upload.single("photoUrl"),
  validatePersonFormData(personValidation.updatePerson),
  updatePerson
);

/* ---------------------- DELETE ROUTES ---------------------- */


router.delete("/:id", requireAuth, checkRole(["admin"]), deletePerson);

/* ---------------------- JSON API ROUTES (Alternative) ---------------------- */
// These routes accept JSON instead of form-data (no file uploads)

router.post(
  "/json",
  requireAuth,
  checkRole(["admin"]),
  validatePerson(personValidation.createPerson),
  createPerson
);

router.patch(
  "/:id/json",
  requireAuth,
  checkRole(["admin"]),
  validatePerson(personValidation.updatePerson),
  updatePerson
);

export default router;
/**
 * @swagger
 * tags:
 *   name: People
 *   description: API for managing people (actors, directors, writers)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Person:
 *       type: object
 *       required:
 *         - name
 *         - roles
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID of the person
 *           example: "66f8b3f4f1234567890abcd1"
 *         name:
 *           type: string
 *           description: Person's full name
 *           example: "Christopher Nolan"
 *         bio:
 *           type: string
 *           description: Biography of the person
 *           example: "British-American film director, producer, and screenwriter known for films like Inception and The Dark Knight"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date of birth
 *           example: "1970-07-30"
 *         photoUrl:
 *           type: string
 *           description: URL of the profile photo
 *           example: "https://res.cloudinary.com/example/christopher-nolan.jpg"
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *             enum: [actor, director, writer]
 *           description: Roles the person has in the industry
 *           example: ["director", "writer"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the person was created
 *           example: "2025-01-15T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the person was last updated
 *           example: "2025-01-15T10:00:00.000Z"
 *       example:
 *         _id: "66f8b3f4f1234567890abcd1"
 *         name: "Christopher Nolan"
 *         bio: "British-American film director, producer, and screenwriter known for films like Inception and The Dark Knight"
 *         dateOfBirth: "1970-07-30"
 *         photoUrl: "https://res.cloudinary.com/example/christopher-nolan.jpg"
 *         roles: ["director", "writer"]
 *         createdAt: "2025-01-15T10:00:00.000Z"
 *         updatedAt: "2025-01-15T10:00:00.000Z"
 *
 *     CreatePersonRequest:
 *       type: object
 *       required:
 *         - name
 *         - roles
 *       properties:
 *         name:
 *           type: string
 *           description: Person's full name
 *           example: "Christopher Nolan"
 *         bio:
 *           type: string
 *           description: Biography of the person
 *           example: "British-American film director, producer, and screenwriter"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date of birth
 *           example: "1970-07-30"
 *         roles:
 *           type: string
 *           description: JSON string of roles array
 *           example: '["director", "writer"]'
 *         photoUrl:
 *           type: string
 *           format: binary
 *           description: Profile photo file (JPG, PNG, WEBP)
 *       example:
 *         name: "Christopher Nolan"
 *         bio: "British-American film director, producer, and screenwriter"
 *         dateOfBirth: "1970-07-30"
 *         roles: '["director", "writer"]'
 *
 *     UpdatePersonRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Updated full name
 *           example: "Christopher Nolan Updated"
 *         bio:
 *           type: string
 *           description: Updated biography
 *           example: "Updated biography for British-American film director"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Updated date of birth
 *           example: "1970-07-30"
 *         roles:
 *           type: string
 *           description: JSON string of updated roles array
 *           example: '["director", "writer", "actor"]'
 *         photoUrl:
 *           type: string
 *           format: binary
 *           description: Updated profile photo file (JPG, PNG, WEBP)
 *       example:
 *         name: "Christopher Nolan Updated"
 *         bio: "Updated biography for British-American film director"
 *         roles: '["director", "writer", "actor"]'
 *
 *     PersonEntities:
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
 *               example: "66f8b3f4f1234567890abcd1"
 *             name:
 *               type: string
 *               example: "Christopher Nolan"
 *             photoUrl:
 *               type: string
 *               example: "https://res.cloudinary.com/example/christopher-nolan.jpg"
 *         movies:
 *           type: object
 *           properties:
 *             asDirector:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       type:
 *                         type: string
 *                       posterUrl:
 *                         type: string
 *                       releaseDate:
 *                         type: string
 *                         format: date
 *                       rating:
 *                         type: number
 *                 total:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *             asCast:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       type:
 *                         type: string
 *                       posterUrl:
 *                         type: string
 *                       releaseDate:
 *                         type: string
 *                         format: date
 *                       rating:
 *                         type: number
 *                 total:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *
 *     PersonStats:
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
 *               example: "66f8b3f4f1234567890abcd1"
 *             name:
 *               type: string
 *               example: "Christopher Nolan"
 *             roles:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["director", "writer"]
 *         stats:
 *           type: object
 *           properties:
 *             asDirector:
 *               type: object
 *               properties:
 *                 totalEntities:
 *                   type: integer
 *                   example: 5
 *                 avgRating:
 *                   type: number
 *                   example: 8.7
 *                 genres:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 *             asCast:
 *               type: object
 *               properties:
 *                 totalEntities:
 *                   type: integer
 *                   example: 2
 *                 avgRating:
 *                   type: number
 *                   example: 8.2
 *                 genres:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
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
 */

/**
 * @swagger
 * /api/people:
 *   get:
 *     summary: Get all people with pagination and filters
 *     tags: [People]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [actor, director, writer]
 *         description: Filter by person role
 *         example: "director"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or bio
 *         example: "Nolan"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of people per page
 *         example: 10
 *     responses:
 *       200:
 *         description: People retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 people:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Person'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     pages:
 *                       type: integer
 *                       example: 5
 *             example:
 *               success: true
 *               people:
 *                 - _id: "66f8b3f4f1234567890abcd1"
 *                   name: "Christopher Nolan"
 *                   bio: "British-American film director, producer, and screenwriter"
 *                   dateOfBirth: "1970-07-30"
 *                   roles: ["director", "writer"]
 *                   photoUrl: "https://res.cloudinary.com/example/christopher-nolan.jpg"
 *                   createdAt: "2025-01-15T10:00:00.000Z"
 *                   updatedAt: "2025-01-15T10:00:00.000Z"
 *                 - _id: "66f8b3f4f1234567890abcd2"
 *                   name: "Leonardo DiCaprio"
 *                   bio: "American actor and film producer"
 *                   dateOfBirth: "1974-11-11"
 *                   roles: ["actor"]
 *                   photoUrl: "https://res.cloudinary.com/example/leonardo-dicaprio.jpg"
 *                   createdAt: "2025-01-15T10:00:00.000Z"
 *                   updatedAt: "2025-01-15T10:00:00.000Z"
 *               pagination:
 *                 total: 50
 *                 page: 1
 *                 limit: 10
 *                 pages: 5
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while fetching people"
 */

/**
 * @swagger
 * /api/people/role/{role}:
 *   get:
 *     summary: Get people by specific role with pagination
 *     tags: [People]
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [actor, director, writer]
 *         description: Person role to filter by
 *         example: "director"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of people per page
 *         example: 10
 *     responses:
 *       200:
 *         description: People by role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 people:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       photoUrl:
 *                         type: string
 *                       dateOfBirth:
 *                         type: string
 *                         format: date
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: string
 *                 role:
 *                   type: string
 *                   example: "director"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 20
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     pages:
 *                       type: integer
 *                       example: 2
 *             example:
 *               success: true
 *               people:
 *                 - name: "Christopher Nolan"
 *                   photoUrl: "https://res.cloudinary.com/example/christopher-nolan.jpg"
 *                   dateOfBirth: "1970-07-30"
 *                   roles: ["director", "writer"]
 *                 - name: "Steven Spielberg"
 *                   photoUrl: "https://res.cloudinary.com/example/steven-spielberg.jpg"
 *                   dateOfBirth: "1946-12-18"
 *                   roles: ["director"]
 *               role: "director"
 *               pagination:
 *                 total: 20
 *                 page: 1
 *                 limit: 10
 *                 pages: 2
 *       400:
 *         description: Invalid role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid role. Must be: actor, director, or writer"
 *               error: "Invalid role parameter"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while fetching people by role"
 */

/**
 * @swagger
 * /api/people/{id}:
 *   get:
 *     summary: Get person by ID
 *     tags: [People]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the person
 *         example: "66f8b3f4f1234567890abcd1"
 *     responses:
 *       200:
 *         description: Person retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 person:
 *                   $ref: '#/components/schemas/Person'
 *             example:
 *               success: true
 *               person:
 *                 _id: "66f8b3f4f1234567890abcd1"
 *                 name: "Christopher Nolan"
 *                 bio: "British-American film director, producer, and screenwriter"
 *                 dateOfBirth: "1970-07-30"
 *                 roles: ["director", "writer"]
 *                 photoUrl: "https://res.cloudinary.com/example/christopher-nolan.jpg"
 *                 createdAt: "2025-01-15T10:00:00.000Z"
 *                 updatedAt: "2025-01-15T10:00:00.000Z"
 *       400:
 *         description: Invalid person ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid person ID format"
 *               error: "The provided ID does not match the MongoDB ObjectId format"
 *       404:
 *         description: Person not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Person not found"
 *               error: "No person found with the provided ID"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while fetching person"
 */

/**
 * @swagger
 * /api/people/{id}/movies:
 *   get:
 *     summary: Get movies/shows where person appears (as director or cast) with pagination
 *     tags: [People]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the person
 *         example: "66f8b3f4f1234567890abcd1"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of entities per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Person's entities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PersonEntities'
 *             example:
 *               success: true
 *               person:
 *                 _id: "66f8b3f4f1234567890abcd1"
 *                 name: "Christopher Nolan"
 *                 photoUrl: "https://res.cloudinary.com/example/christopher-nolan.jpg"
 *               movies:
 *                 asDirector:
 *                   items:
 *                     - title: "Inception"
 *                       type: "movie"
 *                       posterUrl: "https://res.cloudinary.com/example/inception-poster.jpg"
 *                       releaseDate: "2010-07-16"
 *                       rating: 8.8
 *                     - title: "The Dark Knight"
 *                       type: "movie"
 *                       posterUrl: "https://res.cloudinary.com/example/dark-knight-poster.jpg"
 *                       releaseDate: "2008-07-18"
 *                       rating: 9.0
 *                   total: 5
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     pages: 1
 *                 asCast:
 *                   items: []
 *                   total: 0
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     pages: 0
 *       400:
 *         description: Invalid person ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid person ID format"
 *               error: "The provided ID does not match the MongoDB ObjectId format"
 *       404:
 *         description: Person not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Person not found"
 *               error: "No person found with the provided ID"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while fetching person's entities"
 */

/**
 * @swagger
 * /api/people/{id}/stats:
 *   get:
 *     summary: Get person statistics (movie count, average ratings, genres)
 *     tags: [People]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the person
 *         example: "66f8b3f4f1234567890abcd1"
 *     responses:
 *       200:
 *         description: Person statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PersonStats'
 *             example:
 *               success: true
 *               person:
 *                 _id: "66f8b3f4f1234567890abcd1"
 *                 name: "Christopher Nolan"
 *                 roles: ["director", "writer"]
 *               stats:
 *                 asDirector:
 *                   totalEntities: 5
 *                   avgRating: 8.7
 *                   genres:
 *                     - - name: "Sci-Fi"
 *                         description: "Explores futuristic concepts"
 *                       - name: "Thriller"
 *                         description: "Suspenseful storytelling"
 *                     - - name: "Action"
 *                         description: "High-energy action sequences"
 *                       - name: "Crime"
 *                         description: "Focuses on criminal activities and justice"
 *                 asCast:
 *                   totalEntities: 0
 *                   avgRating: 0
 *                   genres: []
 *       400:
 *         description: Invalid person ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid person ID format"
 *               error: "The provided ID does not match the MongoDB ObjectId format"
 *       404:
 *         description: Person not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Person not found"
 *               error: "No person found with the provided ID"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while fetching person stats"
 */

/**
 * @swagger
 * /api/people:
 *   post:
 *     summary: Create a new person (Admin only)
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreatePersonRequest'
 *     responses:
 *       201:
 *         description: Person created successfully
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
 *                   example: "Person created successfully"
 *                 person:
 *                   $ref: '#/components/schemas/Person'
 *             example:
 *               success: true
 *               message: "Person created successfully"
 *               person:
 *                 _id: "66f8b3f4f1234567890abcd1"
 *                 name: "Christopher Nolan"
 *                 bio: "British-American film director, producer, and screenwriter"
 *                 dateOfBirth: "1970-07-30T00:00:00.000Z"
 *                 roles: ["director", "writer"]
 *                 photoUrl: "https://res.cloudinary.com/example/christopher-nolan.jpg"
 *                 createdAt: "2025-01-15T10:00:00.000Z"
 *                 updatedAt: "2025-01-15T10:00:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Validation failed"
 *               error: "Name is required"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error: "No valid JWT token provided"
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Forbidden"
 *               error: "Admin access required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while creating person"
 */

/**
 * @swagger
 * /api/people/{id}:
 *   patch:
 *     summary: Update person (partial update, Admin only)
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the person
 *         example: "66f8b3f4f1234567890abcd1"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePersonRequest'
 *     responses:
 *       200:
 *         description: Person updated successfully
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
 *                   example: "Person updated successfully"
 *                 person:
 *                   $ref: '#/components/schemas/Person'
 *             example:
 *               success: true
 *               message: "Person updated successfully"
 *               person:
 *                 _id: "66f8b3f4f1234567890abcd1"
 *                 name: "Christopher Nolan Updated"
 *                 bio: "Updated biography for British-American film director"
 *                 dateOfBirth: "1970-07-30T00:00:00.000Z"
 *                 roles: ["director", "writer", "actor"]
 *                 photoUrl: "https://res.cloudinary.com/example/christopher-nolan-updated.jpg"
 *                 createdAt: "2025-01-15T10:00:00.000Z"
 *                 updatedAt: "2025-01-15T12:00:00.000Z"
 *       400:
 *         description: Invalid person ID or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid person ID format"
 *               error: "The provided ID does not match the MongoDB ObjectId format"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error: "No valid JWT token provided"
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Forbidden"
 *               error: "Admin access required"
 *       404:
 *         description: Person not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Person not found"
 *               error: "No person found with the provided ID"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while updating person"
 */

/**
 * @swagger
 * /api/people/{id}:
 *   delete:
 *     summary: Delete person (Admin only)
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the person
 *         example: "66f8b3f4f1234567890abcd1"
 *     responses:
 *       200:
 *         description: Person deleted successfully
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
 *                   example: "Person deleted successfully"
 *                 deletedPerson:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "66f8b3f4f1234567890abcd1"
 *                     name:
 *                       type: string
 *                       example: "Christopher Nolan"
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["director", "writer"]
 *             example:
 *               success: true
 *               message: "Person deleted successfully"
 *               deletedPerson:
 *                 id: "66f8b3f4f1234567890abcd1"
 *                 name: "Christopher Nolan"
 *                 roles: ["director", "writer"]
 *       400:
 *         description: Invalid person ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid person ID format"
 *               error: "The provided ID does not match the MongoDB ObjectId format"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error: "No valid JWT token provided"
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Forbidden"
 *               error: "Admin access required"
 *       404:
 *         description: Person not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Person not found"
 *               error: "No person found with the provided ID"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while deleting person"
 */

/**
 * @swagger
 * /api/people/json:
 *   post:
 *     summary: Create a new person with JSON (no file upload, Admin only)
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePersonRequest'
 *     responses:
 *       201:
 *         description: Person created successfully
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
 *                   example: "Person created successfully"
 *                 person:
 *                   $ref: '#/components/schemas/Person'
 *             example:
 *               success: true
 *               message: "Person created successfully"
 *               person:
 *                 _id: "66f8b3f4f1234567890abcd1"
 *                 name: "Christopher Nolan"
 *                 bio: "British-American film director, producer, and screenwriter"
 *                 dateOfBirth: "1970-07-30T00:00:00.000Z"
 *                 roles: ["director", "writer"]
 *                 photoUrl: "https://res.cloudinary.com/example/christopher-nolan.jpg"
 *                 createdAt: "2025-01-15T10:00:00.000Z"
 *                 updatedAt: "2025-01-15T10:00:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Validation failed"
 *               error: "Name is required"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error: "No valid JWT token provided"
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Forbidden"
 *               error: "Admin access required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while creating person with JSON"
 */

/**
 * @swagger
 * /api/people/{id}/json:
 *   patch:
 *     summary: Update person with JSON (no file upload, Admin only)
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the person
 *         example: "66f8b3f4f1234567890abcd1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePersonRequest'
 *     responses:
 *       200:
 *         description: Person updated successfully
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
 *                   example: "Person updated successfully"
 *                 person:
 *                   $ref: '#/components/schemas/Person'
 *             example:
 *               success: true
 *               message: "Person updated successfully"
 *               person:
 *                 _id: "66f8b3f4f1234567890abcd1"
 *                 name: "Christopher Nolan Updated"
 *                 bio: "Updated biography for British-American film director"
 *                 dateOfBirth: "1970-07-30T00:00:00.000Z"
 *                 roles: ["director", "writer", "actor"]
 *                 photoUrl: "https://res.cloudinary.com/example/christopher-nolan-updated.jpg"
 *                 createdAt: "2025-01-15T10:00:00.000Z"
 *                 updatedAt: "2025-01-15T12:00:00.000Z"
 *       400:
 *         description: Invalid person ID or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid person ID format"
 *               error: "The provided ID does not match the MongoDB ObjectId format"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error: "No valid JWT token provided"
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Forbidden"
 *               error: "Admin access required"
 *       404:
 *         description: Person not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Person not found"
 *               error: "No person found with the provided ID"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Server error"
 *               error: "Internal server error occurred while updating person with JSON"
 */