import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import StatusCodes from "../utils/repsonseCode.js";
import ErrorResponse from "../utils/errorResponse.js";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(
        new ErrorResponse("No token. Unauthorized.", StatusCodes.UNAUTHORIZED)
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)

    if (!user) {
      return next(
        new ErrorResponse(
          "User not found. Unauthorized.",
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse("Token invalid or expired.", StatusCodes.UNAUTHORIZED));
  }
};


export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          "Forbidden: Insufficient permissions",
          StatusCodes.FORBIDDEN
        )
      );
    }
    next();
  };
};
