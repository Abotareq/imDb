/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and profile operations
 */

/* ---------- USER ROUTES ---------- */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
 
/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: AhmedT
 *               email:
 *                 type: string
 *                 example: ahmed@example.com
 *               avatar:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *               bio:
 *                 type: string
 *                 example: Hello, I love movies!
 *     responses:
 *       200:
 *         description: User profile updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
 
/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete logged-in user's account
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 */
 
/* ---------- ADMIN ROUTES ---------- */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
 
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               avatar:
 *                 type: string
 *               bio:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               verified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
 
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

import express from "express";
import {
  getMe,
  updateMe,
  deleteMe,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/user.controller.js";
import validateRequest from "../middlewares/validate.js";
import userValidation from "../validations/user.validation.js";
import { checkRole, requireAuth } from "../auth/auth.middleware.js";

const router = express.Router();

/* ---------- USER ROUTES ---------- */
router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, validateRequest(userValidation.updateUserSchema), updateMe);
router.delete("/me", requireAuth, deleteMe);

/* ---------- ADMIN ROUTES ---------- */
router.get("/", requireAuth, checkRole(["admin"]), getAllUsers);
router.get("/:id", requireAuth, checkRole(["admin"]), getUserById);
router.put(
  "/:id",
  requireAuth,
  checkRole(["admin"]),
  validateRequest(userValidation.adminUpdateUserSchema),
  updateUserById
);
router.delete("/:id", requireAuth, checkRole(["admin"]), deleteUserById);

export default router;
