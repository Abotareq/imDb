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
/**
 * @swagger
 * tags:
 *   name: People
 *   description: People management operations (actors, directors)
 */

/**
 * @swagger
 * /api/people:
 *
 *
 *
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or bio
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
 *         description: Number of people per page
 *     responses:
 *       200:
 *         description: People retrieved successfully
 */
router.get("/", validateQuery(personValidation.queryParams), getAllPeople);

/**
 * @swagger
 * /api/people/role/{role}:
 *   get:
 *     summary: Get people by specific role
 *     tags: [People]
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [actor, director, writer]
 *         description: Person role
 */
router.get(
  "/role/:role",
  validateParams(personValidation.getPersonsByRole),
  validateQuery(personValidation.queryParams),
  getPersonsByRole
);

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
 *         description: Person ID
 */
router.get("/:id", getPersonById);

/**
 * @swagger
 * /api/people/{id}/movies:
 *   get:
 *     summary: Get movies/shows where person appears (as director or cast)
 *     tags: [People]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Person ID
 */
router.get(
  "/:id/movies",
  validateQuery(personValidation.queryParams),
  getPersonEntities
);

/**
 * @swagger
 * /api/people/{id}/stats:
 *   get:
 *     summary: Get person statistics (movie count, ratings, etc.)
 *     tags: [People]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Person ID
 */
router.get("/:id/stats", getPersonStats);

/* ---------------------- CREATE ROUTES ---------------------- */

/**
 * @swagger
 * /api/people:
 *   post:
 *     summary: Create a new person
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - roles
 *             properties:
 *               name:
 *                 type: string
 *                 description: Person's full name
 *               bio:
 *                 type: string
 *                 description: Biography
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: Date of birth
 *               roles:
 *                 type: string
 *                 description: JSON array of roles
 *                 example: '["actor", "director"]'
 *               photoUrl:
 *                 type: string
 *                 format: binary
 *                 description: Profile photo
 */
router.post(
  "/",
  requireAuth,
  checkRole(["admin"]),
  upload.single("photoUrl"), // Single file upload for photo
  validatePersonFormData(personValidation.createPerson),
  createPerson
);

/* ---------------------- UPDATE ROUTES ---------------------- */

/**
 * @swagger
 * /api/people/{id}:
 *   patch:
 *     summary: Update person (partial update)
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Person ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Person's full name
 *               bio:
 *                 type: string
 *                 description: Biography
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: Date of birth
 *               roles:
 *                 type: string
 *                 description: JSON array of roles
 *                 example: '["actor", "director"]'
 *               photoUrl:
 *                 type: string
 *                 format: binary
 *                 description: New profile photo
 */
router.patch(
  "/:id",
  requireAuth,
  checkRole(["admin"]),
  upload.single("photoUrl"),
  validatePersonFormData(personValidation.updatePerson),
  updatePerson
);

/* ---------------------- DELETE ROUTES ---------------------- */

/**
 * @swagger
 * /api/people/{id}:
 *   delete:
 *     summary: Delete person
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Person ID
 */
router.delete("/:id", requireAuth, checkRole(["admin"]), deletePerson);

/* ---------------------- JSON API ROUTES (Alternative) ---------------------- */
// These routes accept JSON instead of form-data (no file uploads)

/**
 * @swagger
 * /api/people/json:
 *   post:
 *     summary: Create person with JSON (no file upload)
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - roles
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               photoUrl:
 *                 type: string
 *                 format: uri
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [actor, director, writer]
 */
router.post(
  "/json",
  requireAuth,
  checkRole(["admin"]),
  validatePerson(personValidation.createPerson),
  createPerson
);

/**
 * @swagger
 * /api/people/{id}/json:
 *   patch:
 *     summary: Update person with JSON (no file upload)
 *     tags: [People]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               photoUrl:
 *                 type: string
 *                 format: uri
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [actor, director, writer]
 */
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
 *           description: The auto-generated id of the person
 *         name:
 *           type: string
 *           description: Person's full name
 *         bio:
 *           type: string
 *           description: Biography
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date of birth
 *         photoUrl:
 *           type: string
 *           description: URL of the profile photo
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *             enum: [actor, director, writer]
 *           description: Person's roles in the industry
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         name: "Christopher Nolan"
 *         bio: "British-American film director, producer, and screenwriter"
 *         dateOfBirth: "1970-07-30"
 *         roles: ["director", "writer"]
 *         photoUrl: "https://example.com/photo.jpg"
 */
