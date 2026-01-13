import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import User from "../models/user.models.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password -refreshToken -emailVerificationToken -passwordResetToken ");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200,"User Profile fetched successfully",user));
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const { name, email, phoneNo, avatar } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  user.phoneNo = phoneNo || user.phoneNo;
  user.avatar = avatar || user.avatar;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "User profile updated successfully", user));
});

export const deleteUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  await user.deleteOne();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  };
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  return res
    .status(200)
    .json(new ApiResponse(200, "User profile deleted successfully"));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  if (!users || users.length === 0) {
    throw new ApiError(404, "No users found");
  }
  const userCount = users.length;
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Users fetched successfully", { users, userCount })
    );
});

export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(404, "User not found");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const { oldPassword, newPassword } = req.body;
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new ApiError(401, "Old password is incorrect");
  }
  user.password = newPassword;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));
});

export const getEnrolledCourses = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate({
    path: "enrolledCourses",
    select: "-students",
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Enrolled courses fetched successfully",
        user.enrolledCourses
      )
    );
});

export const createdCourses = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  const allowedRoles = ["admin", "super-admin"];
  if (!allowedRoles.includes(userRole)) {
    throw new ApiError(
      403,
      "Access denied. Only admins and super-admins can access created courses."
    );
  }
  const userId = req.user._id;
  const user = await User.findById(userId).populate({
    path: "createdCourses",
    select: "-students",
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Created courses fetched successfully",
        user.createdCourses
      )
    );
});
