// routes/character.routes.js
import express from "express";
import {
  getAllCharacters,
  getCharacterById,
  getCharactersByEntity,
  getCharactersByActor,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  createMultipleCharacters,
  deleteCharactersByEntity,
} from "../controllers/character.controller.js";
import {
  characterValidation,
  validateCharacter,
  validateQuery,
  validateParams,
  validateObjectId,
} from "../validations/character.validation.js";
import { requireAuth, checkRole } from "../auth/auth.middleware.js";

const router = express.Router();

/* ---------------------- READ ROUTES ---------------------- */

/**
 * @swagger
 * /api/characters:
 *   get:
 *     summary: Get all characters with pagination and filters
 *     tags: [Characters]
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
 *         description: Number of characters per page
 *       - in: query
 *         name: entity
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Filter by entity ID
 *       - in: query
 *         name: actor
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Filter by actor ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by character name or description
 *     responses:
 *       200:
 *         description: Characters retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 characters:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Character'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  validateQuery(characterValidation.queryParams),
  getAllCharacters
);

/**
 * @swagger
 * /api/characters/entity/{entityId}:
 *   get:
 *     summary: Get all characters in a specific entity (movie/TV show)
 *     tags: [Characters]
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
 *         description: Characters retrieved successfully
 *       400:
 *         description: Invalid entity ID format
 *       404:
 *         description: Entity not found
 */
router.get(
  "/entity/:entityId",
  validateParams(characterValidation.entityParams),
  validateQuery(characterValidation.queryParams),
  getCharactersByEntity
);

/**
 * @swagger
 * /api/characters/actor/{actorId}:
 *   get:
 *     summary: Get all characters played by a specific actor
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: actorId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Actor ID
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
 *         description: Characters retrieved successfully
 *       400:
 *         description: Invalid actor ID format or person is not an actor
 *       404:
 *         description: Actor not found
 */
router.get(
  "/actor/:actorId",
  validateParams(characterValidation.actorParams),
  validateQuery(characterValidation.queryParams),
  getCharactersByActor
);

/**
 * @swagger
 * /api/characters/{id}:
 *   get:
 *     summary: Get character by ID
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Character ID
 *     responses:
 *       200:
 *         description: Character retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 character:
 *                   $ref: '#/components/schemas/CharacterDetailed'
 *       400:
 *         description: Invalid character ID format
 *       404:
 *         description: Character not found
 */
router.get(
  "/:id",
  validateParams(characterValidation.pathParams),
  getCharacterById
);

/* ---------------------- CREATE ROUTES ---------------------- */

/**
 * @swagger
 * /api/characters:
 *   post:
 *     summary: Create a new character
 *     tags: [Characters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCharacter'
 *     responses:
 *       201:
 *         description: Character created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 character:
 *                   $ref: '#/components/schemas/Character'
 *       400:
 *         description: Validation error or person is not an actor
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Actor or entity not found
 *       409:
 *         description: Character already exists for this actor in this entity
 */
router.post(
  "/",
  requireAuth,
  checkRole(["admin"]),
  validateCharacter(characterValidation.createCharacter),
  createCharacter
);

/**
 * @swagger
 * /api/characters/bulk:
 *   post:
 *     summary: Create multiple characters at once
 *     tags: [Characters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               characters:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CreateCharacter'
 *                 minItems: 1
 *                 maxItems: 50
 *     responses:
 *       201:
 *         description: Characters created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Duplicate character found
 */
router.post(
  "/bulk",
  requireAuth,
  checkRole(["admin"]),
  validateCharacter(characterValidation.createMultipleCharacters),
  createMultipleCharacters
);

/* ---------------------- UPDATE ROUTES ---------------------- */

/**
 * @swagger
 * /api/characters/{id}:
 *   patch:
 *     summary: Update character (partial update)
 *     tags: [Characters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Character ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCharacter'
 *     responses:
 *       200:
 *         description: Character updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 character:
 *                   $ref: '#/components/schemas/Character'
 *       400:
 *         description: Invalid character ID or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Character, actor, or entity not found
 *       409:
 *         description: Character already exists for this actor in this entity
 */
router.patch(
  "/:id",
  requireAuth,
  checkRole(["admin"]),
  validateParams(characterValidation.pathParams),
  validateCharacter(characterValidation.updateCharacter),
  updateCharacter
);

/* ---------------------- DELETE ROUTES ---------------------- */

/**
 * @swagger
 * /api/characters/{id}:
 *   delete:
 *     summary: Delete character
 *     tags: [Characters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Character ID
 *     responses:
 *       200:
 *         description: Character deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deletedCharacter:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     actor:
 *                       type: string
 *                     entity:
 *                       type: string
 *       400:
 *         description: Invalid character ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Character not found
 */
router.delete(
  "/:id",
  requireAuth,
  checkRole(["admin"]),
  validateParams(characterValidation.pathParams),
  deleteCharacter
);

/**
 * @swagger
 * /api/characters/entity/{entityId}:
 *   delete:
 *     summary: Delete all characters in a specific entity (Admin only)
 *     tags: [Characters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}
 *         description: Entity ID
 *     responses:
 *       200:
 *         description: Characters deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deletedCount:
 *                   type: integer
 *       400:
 *         description: Invalid entity ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.delete(
  "/entity/:entityId",
  requireAuth,
  checkRole(["admin"]),
  validateParams(characterValidation.entityParams),
  deleteCharactersByEntity
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Character:
 *       type: object
 *       required:
 *         - name
 *         - actor
 *         - entity
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the character
 *           example: "650a8b3f4f1234567890abcd"
 *         name:
 *           type: string
 *           description: Character's name
 *           example: "Bruce Wayne"
 *         description:
 *           type: string
 *           description: Character description
 *           example: "A billionaire vigilante who fights crime as Batman"
 *         actor:
 *           type: object
 *           description: The actor who plays this character
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abcd"
 *             name:
 *               type: string
 *               example: "Christian Bale"
 *             photoUrl:
 *               type: string
 *               example: "https://example.com/christian-bale.jpg"
 *             roles:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["actor"]
 *         entity:
 *           type: object
 *           description: The movie/TV show this character appears in
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
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *       example:
 *         _id: "650a8b3f4f1234567890abcd"
 *         name: "Bruce Wayne"
 *         description: "A billionaire vigilante who fights crime as Batman"
 *         actor:
 *           _id: "650a8b3f4f1234567890abcd"
 *           name: "Christian Bale"
 *           photoUrl: "https://example.com/christian-bale.jpg"
 *           roles: ["actor"]
 *         entity:
 *           _id: "650a8b3f4f1234567890abce"
 *           title: "Batman Begins"
 *           type: "movie"
 *           posterUrl: "https://example.com/batman-begins-poster.jpg"
 *         createdAt: "2023-09-20T10:30:00.000Z"
 *         updatedAt: "2023-09-20T10:30:00.000Z"
 *
 *     CharacterDetailed:
 *       type: object
 *       description: Character with full actor and entity details
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         actor:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             bio:
 *               type: string
 *             photoUrl:
 *               type: string
 *             dateOfBirth:
 *               type: string
 *               format: date
 *             roles:
 *               type: array
 *               items:
 *                 type: string
 *         entity:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             title:
 *               type: string
 *             type:
 *               type: string
 *             description:
 *               type: string
 *             posterUrl:
 *               type: string
 *             coverUrl:
 *               type: string
 *             rating:
 *               type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateCharacter:
 *       type: object
 *       required:
 *         - name
 *         - actor
 *         - entity
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Character's name
 *           example: "Bruce Wayne"
 *         description:
 *           type: string
 *           maxLength: 1000
 *           description: Character description
 *           example: "A billionaire vigilante who fights crime as Batman"
 *         actor:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}
 *           description: Actor's ObjectId
 *           example: "650a8b3f4f1234567890abcd"
 *         entity:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}
 *           description: Entity's ObjectId
 *           example: "650a8b3f4f1234567890abce"
 *
 *     UpdateCharacter:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Character's name
 *           example: "Bruce Wayne / Batman"
 *         description:
 *           type: string
 *           maxLength: 1000
 *           description: Character description
 *           example: "A billionaire vigilante who fights crime as Batman in Gotham City"
 *         actor:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}
 *           description: New actor's ObjectId
 *           example: "650a8b3f4f1234567890abcd"
 *         entity:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}
 *           description: New entity's ObjectId
 *           example: "650a8b3f4f1234567890abce"
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
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Character:
 *       type: object
 *       required:
 *         - name
 *         - actor
 *         - entity
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the character
 *           example: "650a8b3f4f1234567890abcd"
 *         name:
 *           type: string
 *           description: Character's name
 *           example: "Bruce Wayne"
 *         description:
 *           type: string
 *           description: Character description
 *           example: "A billionaire vigilante who fights crime as Batman"
 *         actor:
 *           type: object
 *           description: The actor who plays this character
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abcd"
 *             name:
 *               type: string
 *               example: "Christian Bale"
 *             photoUrl:
 *               type: string
 *               example: "https://example.com/christian-bale.jpg"
 *             roles:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["actor"]
 *         entity:
 *           type: object
 *           description: The movie/TV show this character appears in
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
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *       example:
 *         _id: "650a8b3f4f1234567890abcd"
 *         name: "Bruce Wayne"
 *         description: "A billionaire vigilante who fights crime as Batman"
 *         actor:
 *           _id: "650a8b3f4f1234567890abcd"
 *           name: "Christian Bale"
 *           photoUrl: "https://example.com/christian-bale.jpg"
 *           roles: ["actor"]
 *         entity:
 *           _id: "650a8b3f4f1234567890abce"
 *           title: "Batman Begins"
 *           type: "movie"
 *           posterUrl: "https://example.com/batman-begins-poster.jpg"
 *         createdAt: "2023-09-20T10:30:00.000Z"
 *         updatedAt: "2023-09-20T10:30:00.000Z"
 *
 *     CharacterDetailed:
 *       type: object
 *       description: Character with full actor and entity details
 *       properties:
 *         _id:
 *           type: string
 *           example: "650a8b3f4f1234567890abcd"
 *         name:
 *           type: string
 *           example: "Bruce Wayne"
 *         description:
 *           type: string
 *           example: "A billionaire vigilante who fights crime as Batman"
 *         actor:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abcd"
 *             name:
 *               type: string
 *               example: "Christian Bale"
 *             bio:
 *               type: string
 *               example: "Welsh actor known for intense method acting"
 *             photoUrl:
 *               type: string
 *               example: "https://example.com/christian-bale.jpg"
 *             dateOfBirth:
 *               type: string
 *               format: date
 *               example: "1974-01-30"
 *             roles:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["actor"]
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
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-09-20T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-09-20T10:30:00.000Z"
 *
 *     CreateCharacter:
 *       type: object
 *       required:
 *         - name
 *         - actor
 *         - entity
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Character's name
 *           example: "Bruce Wayne"
 *         description:
 *           type: string
 *           maxLength: 1000
 *           description: Character description
 *           example: "A billionaire vigilante who fights crime as Batman"
 *         actor:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           description: Actor's ObjectId
 *           example: "650a8b3f4f1234567890abcd"
 *         entity:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           description: Entity's ObjectId
 *           example: "650a8b3f4f1234567890abce"
 *
 *     UpdateCharacter:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Character's name
 *           example: "Bruce Wayne / Batman"
 *         description:
 *           type: string
 *           maxLength: 1000
 *           description: Character description
 *           example: "A billionaire vigilante who fights crime as Batman in Gotham City"
 *         actor:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           description: New actor's ObjectId
 *           example: "650a8b3f4f1234567890abcd"
 *         entity:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           description: New entity's ObjectId
 *           example: "650a8b3f4f1234567890abce"
 *
 *     CreateMultipleCharacters:
 *       type: object
 *       required:
 *         - characters
 *       properties:
 *         characters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CreateCharacter'
 *           minItems: 1
 *           maxItems: 50
 *           description: Array of characters to create
 *           example:
 *             - name: "Bruce Wayne"
 *               description: "Batman"
 *               actor: "650a8b3f4f1234567890abcd"
 *               entity: "650a8b3f4f1234567890abce"
 *             - name: "Alfred Pennyworth"
 *               description: "Wayne family butler"
 *               actor: "650a8b3f4f1234567890abcf"
 *               entity: "650a8b3f4f1234567890abce"
 *
 *     CharacterList:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         characters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Character'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     CharactersByEntity:
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
 *         characters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Character'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     CharactersByActor:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         actor:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "650a8b3f4f1234567890abcd"
 *             name:
 *               type: string
 *               example: "Christian Bale"
 *             photoUrl:
 *               type: string
 *               example: "https://example.com/christian-bale.jpg"
 *         characters:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               entity:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   type:
 *                     type: string
 *                   posterUrl:
 *                     type: string
 *                   releaseDate:
 *                     type: string
 *                     format: date
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     CharacterResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Character created successfully"
 *         character:
 *           $ref: '#/components/schemas/Character'
 *
 *     CharacterDetailedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         character:
 *           $ref: '#/components/schemas/CharacterDetailed'
 *
 *     BulkCharacterResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "5 characters created successfully"
 *         characters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Character'
 *
 *     DeleteCharacterResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Character deleted successfully"
 *         deletedCharacter:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "650a8b3f4f1234567890abcd"
 *             name:
 *               type: string
 *               example: "Bruce Wayne"
 *             actor:
 *               type: string
 *               example: "650a8b3f4f1234567890abcd"
 *             entity:
 *               type: string
 *               example: "650a8b3f4f1234567890abce"
 *
 *     BulkDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "5 characters deleted successfully"
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
