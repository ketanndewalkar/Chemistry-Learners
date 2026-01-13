import {ApiError} from "../utils/api-error.js";

export const errorHandler = (err, req, res, next) => {
  console.log(err)
 
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(e => e.message);

    return res.status(400).json({
      success: false,
      errorType: "ValidationError",
      errors: messages,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      errorType: "DuplicateKey",
      errors: [`${field} already exists`],
    });
  }


  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      errorType: "ApiError",
      errors: [err.message],
    });
  }


  return res.status(500).json({
    success: false,
    errorType: "ServerError",
    errors: [err.message || "Internal Server Error"],
  });
};
