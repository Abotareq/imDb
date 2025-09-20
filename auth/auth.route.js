/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/signout:
 *   post:
 *     summary: Sign out user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully signed out
 */
/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verify authentication status
 *     tags: [Auth]
 *     description: Check if the user is logged in by verifying the JWT stored in cookies.
 *     responses:
 *       200:
 *         description: User is authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loggedIn:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   description: Decoded user information
 *                 token:
 *                   type: string
 *                   description: The JWT token from cookies
 *                 message:
 *                   type: string
 *                   example: User is authenticated
 *       401:
 *         description: Unauthorized (no token or invalid token)
 *       500:
 *         description: Internal server error
 */

import express from "express";
import { signup, signin, signout, getStatus } from "./auth.controller.js";
import validateRequest from "../middlewares/validate.js";
import authValidation from "../validations/auth.validation.js";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(authValidation.signupValidation),
  signup
);

router.post(
  "/signin",
  validateRequest(authValidation.signinValidation),
  signin
);

router.post("/signout", signout);

router.get("/verify", getStatus);

export default router;
