import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import User from "../models/user.models.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { sendVerificationEmail } from "../utils/mail.js";

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNo, role } = req.body;
  if (!name || !email || !password || !phoneNo) {
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists,Please Signin...");
  }
  const user = await User.create({
    name,
    email,
    password,
    phoneNo,
    role,
  });
  if (!user) {
    throw new ApiError(500, "Error wwhile creating user");
  }
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resUser = await User.findOne({ email }).select("-password ");

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "Account created Succesfully,please verify your email",
        resUser,
      ),
    );
  sendVerificationEmail(email, token);
});

export const signin = asyncHandler(async (req, res) => {
  const { email, password, forceLogin } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Both fields are required");
  }
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new ApiError(404, "No Account Found,Please Signup..");
  }

  const isMatched = await existingUser.comparePassword(password);
  if (!isMatched) {
    throw new ApiError(400, "Invalid credientials");
  }
  if (existingUser.activeSessionId && !forceLogin) {
    throw new ApiError(409, "User already logged in from another device");
  }

  const sessionId = uuid();
  existingUser.activeSessionId = sessionId;

  const accessToken = jwt.sign(
    { userId: existingUser._id, sessionId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );

  const refreshToken = jwt.sign(
    { userId: existingUser._id, sessionId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
  existingUser.refreshToken = refreshToken;
  await existingUser.save({ validateBeforeSave: false });
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  };
  const cookieOptions2 = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };
  const existingUser1 = await User.findOne({ email }).select(
    "-password -refreshToken",
  );

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions2)
    .status(200)
    .json(new ApiResponse(200, "User logged in Successfully", existingUser1));
});

export const getMe = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select(
    "-password -refreshToken -emailVerificationToken  ",
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Profile fetched Successfully", user));
});

export const logOut = asyncHandler(async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  const cookieOptions2 = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };
  const userId = req.user._id;
  await User.findByIdAndUpdate(userId, {
    $unset: { refreshToken: "" },
    activeSessionId: null,
  });

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions2);
  return res.status(200).json(new ApiResponse(200, "User Logged Out..", null));
});

export const emailVerification = asyncHandler(async (req, res) => {
  const token = req.params.token;

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
  });

 if (!user) {
  return res
    .status(200)
    .json(new ApiResponse(200, "Email already verified", null));
}


  if (user.isEmailVerified) {
    return res
      .status(200)
      .json(new ApiResponse(200, "Email already verified", null));
  }

  if (user.emailVerificationTokenExpiry < Date.now()) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "Email verified successfully", null));
});


export const resendEmailVerification = asyncHandler(async (req, res) => {
  const id = req.user._id;

  const user = await User.findById(id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid token");
  }

  if (user.isEmailVerified) {
    throw new ApiError(401, "Email already verified");
  }

  const emailVerificationToken = crypto.randomBytes(32).toString("hex");

  const hashedemailVerificationToken = crypto
    .createHash("sha256")
    .update(emailVerificationToken)
    .digest("hex");

  user.emailVerificationToken = hashedemailVerificationToken;

  user.emailVerificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await user.save({ validateBeforeSave: false });

  await sendVerificationEmail(user.email, emailVerificationToken);

  return res
    .status(200)
    .json(new ApiResponse(200, "Email Verification link sent"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Refresh token expired");
    }
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (payload.sessionId !== user.activeSessionId) {
    throw new ApiError(401, "Session expired");
  }

  if (user.refreshToken !== refreshToken) {
    throw new ApiError(403, "Token mismatch");
  }

  const newAccessToken = jwt.sign(
    { userId: user._id, sessionId: user.activeSessionId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );

  const newRefreshToken = jwt.sign(
    { userId: user._id, sessionId: user.activeSessionId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  };

  const cookieOptions2 = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };

  return res
    .cookie("accessToken", newAccessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions2)
    .status(200)
    .json(
      new ApiResponse(200, "New tokens generated", {
        accessToken: newAccessToken,
      }),
    );
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "No user found");
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, "Both Password and confirm Password should Match");
  }
  user.password = password;

  await user.save();
  const resUser = await User.findById(user._id).select(
    "-refreshToken -password",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed Succesfully", resUser));
});
