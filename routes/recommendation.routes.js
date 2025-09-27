// routes/recommendation.routes.js
import express from "express";
import { requireAuth, checkRole } from "../auth/auth.middleware.js";
import { getRecommendations } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.get("/", requireAuth, checkRole(["user"]), getRecommendations);

export default router;
// (Assuming this is added to an existing Swagger file, e.g., where other endpoints are defined)

/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: Personalized content recommendations
 */

/**
 * @swagger
 * /api/recommendations:
 *   get:
 *     summary: Get personalized recommendations
 *     tags: [Recommendations]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Recommendations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "650a8b3f4f1234567890abcd"
 *                       title:
 *                         type: string
 *                         example: "Oppenheimer"
 *                       type:
 *                         type: string
 *                         example: "movie"
 *                       posterUrl:
 *                         type: string
 *                         example: "https://example.com/oppenheimer-poster.jpg"
 *                       genres:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "drama"
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
