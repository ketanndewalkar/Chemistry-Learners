import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { uploadImage } from "../utils/cloudinary.js";
import Course from "../models/course.models.js";       


export const createCourse = asyncHandler(async(req,res) => {
    const { title, description, courseFees } = req.body;
    
    if(!title || !description || !courseFees){
        throw new ApiError(400, "All fields are required to create a course");
    }
    if(!req.file){
        throw new ApiError(400, "Course image is required");
    }
    const result = await uploadImage(req.file.path);
    
    if(!result?.secure_url){
        throw new ApiError(500, "Failed to upload course image to cloudinary. Try again.");
    }
    const courseImage = result.secure_url;
    const createdBy = req.user._id;

    const course = await Course.create({
        title,
        description,
        courseFees,
        courseImage,
        createdBy
    });
    if(!course){
        throw new ApiError(500, "Failed to create course. Try again.");
    }
    res.status(201).json(new ApiResponse(201, "Course created successfully", course));
})

export const getCourses = asyncHandler(async(req,res) => {
    const status = req.query.status;
    const filter = {};
    if (req.user.role === "admin" && !status){
        throw new ApiError(400,"Please provide course status in query for filter")
    }
    if(req.user.role !== "admin"){
        filter.coursePublishedStatus = "published";
    }
    if(status){
        filter.coursePublishedStatus = status;
    }
    const courses = await Course.find(filter).populate("createdBy", "name email").populate("chapters");
    if(!courses){
        throw new ApiError(500, "Failed to fetch courses. Try again.");
    }
    res.status(200).json(new ApiResponse(200, "Courses fetched successfully", courses));
})

export const getCourse = asyncHandler(async(req,res) => {
    const {courseId} = req.params;
    if(!courseId){
        throw new ApiError(400,"Course Id is required");
    };
    const course = await Course.findById(courseId).populate("createdBy", "name email").populate("chapters");
    if(!course){
        throw new ApiError(404, "Course not found");
    };
    res.status(200).json(new ApiResponse(200, "Course fetched successfully", course));
})

export const updateCourse = asyncHandler(async(req,res)=> {
    const {courseId} = req.params;
    if(!courseId){
        throw new ApiError(400,"Course Id is required");
    };
    const course = await Course.findById(courseId);
    if(!course){
        throw new ApiError(404, "Course not found");
    };
    const { title, description, courseFees, coursePublishedStatus } = req.body;
    if(title) course.title = title;
    if(description) course.description = description;
    if(courseFees) course.courseFees = courseFees;
    if(coursePublishedStatus) course.coursePublishedStatus = coursePublishedStatus;
    await course.save();
    res.status(200).json(new ApiResponse(200, "Course updated successfully", course));
})

export const deleteCourse = asyncHandler(async(req,res) => {
    const {courseId} = req.params;
    if(!courseId){
        throw new ApiError(400,"Course Id is required");
    };
    const course = await Course.findByIdAndDelete(courseId);    
    if(!course){
        throw new ApiError(404, "Course not found");
    };
    res.status(200).json(new ApiResponse(200, "Course deleted successfully", course));
})

export const updateCourseStatus = asyncHandler(async(req,res) => {
    const {courseId} = req.params;
    const { coursePublishedStatus } = req.body; 
    if(!coursePublishedStatus){
        throw new ApiError(400,"Course published status is required");
    }
    if(!courseId){
        throw new ApiError(400,"Course Id is required");
    }
    const course = await Course.findById(courseId);
    if(!course){
        throw new ApiError(404, "Course not found");
    }
    course.coursePublishedStatus = coursePublishedStatus;
    await course.save();
    res.status(200).json(new ApiResponse(200, "Course status updated successfully", course));
})

export const enrollInCourse = asyncHandler(async(req,res) => {
    const {courseId} = req.params;
    if(!courseId){
        throw new ApiError(400,"Course Id is required");
    }
    const course = await Course.findById(courseId);
    if(!course){
        throw new ApiError(404, "Course not found");
    }
    const userId = req.user._id;
    if(course.enrolledStudents.includes(userId)){
        throw new ApiError(400, "User already enrolled in this course");
    }
    course.enrolledStudents.push(userId);
    await course.save();
    res.status(200).json(new ApiResponse(200, "User enrolled in course successfully", course)); 
})