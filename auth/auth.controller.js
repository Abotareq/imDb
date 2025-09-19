import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import { generateToken } from "./auth.utils.js"; 
import StatusCodes from "../utils/repsonseCode.js";

const setAuthCookie = (res, token) => {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body; // already validated

    const exists = await User.findOne({ email });
    if (exists) return next(new ErrorResponse("Email already registered", StatusCodes.BAD_REQUEST));

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Signin
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body; // already validated

    const user = await User.findOne({ email });
    if (!user) return next(new ErrorResponse("Invalid credentials", StatusCodes.UNAUTHORIZED));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ErrorResponse("Invalid credentials", StatusCodes.UNAUTHORIZED));

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.json({
      success: true,
      message: "Signin successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Signout
export const signout = (req, res) => {
  res.clearCookie("access_token");
  res.json({ success: true, message: "Signed out successfully" });
};

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return next(
        new ErrorResponse(
          "Authentication token missing",
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    next();
  } catch (err) {
    return next(
      new ErrorResponse("Invalid or expired token", StatusCodes.UNAUTHORIZED)
    );
  }
};