import User from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    throw new ApiError(401, "No token found");
  }

  let decoded;
  try {
    decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired");
    }
    throw new ApiError(401, "Invalid access token");
  }

  const user = await User.findById(decoded.userId).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  if (decoded.sessionId !== user.activeSessionId) {
    throw new ApiError(401, "Session expired");
  }

  const now = Date.now();
  const last = user.lastActive?.getTime() || 0;
  const INTERVAL = 5 * 60 * 1000;

  if (now - last > INTERVAL) {
    user.lastActive = new Date(now);
    await user.save({ timestamps: false });
  }

  req.user = user;
  next();
});

export const isAllowed = (...roles) =>
  asyncHandler(async (req, res, next) => {
    const userRole = req.user.role;
    if (!userRole || !roles.includes(userRole)) {
      throw new ApiError(403, "You are not allowed to access this route");
    }
    next();
  });

export const isEmailVerified = asyncHandler(async (req, res, next) => {
  if (!req.user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email to access this route");
  }
  next();
});

export const isEnrolled = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const courseId = req.params.courseId;

  if(user.role === "admin"){
    return next();  
  }

  const isEnrolled =
      user?.enrolledCourses?.some(
        (e) => String(e?.courses) === String(courseId)
      ) ?? false;
  // if (!isEnrolled) {
  //   throw new ApiError(403, "You are not enrolled in this course");
  // }
  next();
});
