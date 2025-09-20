import User from "../models/user.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import StatusCodes from "../utils/repsonseCode.js";

/* ---------- REGULAR USER ---------- */

// Get logged-in user
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return next(new ErrorResponse("User not found", StatusCodes.NOT_FOUND));
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

//  Update logged-in user (cannot update verified/role)
export const updateMe = async (req, res, next) => {
  try {
    const disallowed = ["role", "verified"];
    disallowed.forEach((field) => delete req.body[field]);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return next(new ErrorResponse("User not found", StatusCodes.NOT_FOUND));
    }

    res.json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (err) {
    next(err);
  }
};

//  Delete logged-in user
export const deleteMe = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);
    if (!deletedUser) {
      return next(new ErrorResponse("User not found", StatusCodes.NOT_FOUND));
    }

    res.clearCookie("access_token");
    res.json({ success: true, message: "Account deleted" });
  } catch (err) {
    next(err);
  }
};

/* ---------- ADMIN ---------- */

//  Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return next(new ErrorResponse("User not found", StatusCodes.NOT_FOUND));
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

//  Update user by ID (admin can update everything)
export const updateUserById = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return next(new ErrorResponse("User not found", StatusCodes.NOT_FOUND));
    }

    res.json({ success: true, message: "User updated", user: updatedUser });
  } catch (err) {
    next(err);
  }
};

// Delete user by ID
export const deleteUserById = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return next(new ErrorResponse("User not found", StatusCodes.NOT_FOUND));
    }

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
