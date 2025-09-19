import express from "express";
import {
  signup,
  signin,
  signout,
  verifyToken
} from "./auth.controller.js";
import validateRequest from "../middlewares/validate.js";
import authValidation from "../validations/auth.validation.js";

const router = express.Router();

router.post("/signup", validateRequest(authValidation.signupValidation), signup);


router.post("/signin", validateRequest(authValidation.signinValidation), signin);


router.post("/signout", signout);


router.get("/verify",  verifyToken);

export default router;
