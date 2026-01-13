import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import Course from "../models/course.models.js";
import Enrollment from "../models/enrollment.models.js";


export const getEnrollments = asyncHandler(async(req,res) => {
    const enrollments = await Enrollment.find({student: req.user._id}).populate("course").populate("payment");
    if(!enrollments){
        throw new ApiError(404,"No enrollments found for this student")
    }
    return res.status(200).json(new ApiResponse(200,"Enrollments fetched successfully",enrollments))
})

export const getEnrollmentById = asyncHandler(async(req,res) => {
    const {enrollmentId} = req.params;
    if(!enrollmentId){
        throw new ApiError(400,"Enrollment ID is required")
    }
    const enrollment = await Enrollment.findById(enrollmentId).populate("course").populate("payment");
    if(!enrollment){
        throw new ApiError(404,"Enrollment not found")
    }
    return res.status(200).json(new ApiResponse(200,"Enrollment fetched successfully",enrollment))
})

export const getCoursesOfStudent = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment
    .find({ student: req.user._id, status: "enrolled" })
    .populate("course");

  const courses = enrollments.map(enrollment => enrollment.course);

  return res
    .status(200)
    .json(new ApiResponse(200,"Courses fetched successfully",courses));
});