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
    const { username, email, password } = req.body; // already validated

    const exists = await User.findOne({ email });
    if (exists)
      return next(
        new ErrorResponse("Email already registered", StatusCodes.BAD_REQUEST)
      );

   

    const user = await User.create({
      username,
      email,
      password
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
    if (!user)
      return next(
        new ErrorResponse("Invalid credentials", StatusCodes.UNAUTHORIZED)
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return next(
        new ErrorResponse("Invalid credentials", StatusCodes.UNAUTHORIZED)
      );
  
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

export const getStatus = (req, res, next) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return next(
        new ErrorResponse("No token provided", StatusCodes.UNAUTHORIZED)
      );
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({
        loggedIn: true,
        user: { ...req.user, ...decoded },
        token: token,
        message: "User is authenticated",
      });
    } catch (jwtError) {
      return next(
        new ErrorResponse("Invalid token", StatusCodes.UNAUTHORIZED)
      );
    }
  } catch (error) {
    return next(
      new ErrorResponse(
        "Error retrieving status",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};
