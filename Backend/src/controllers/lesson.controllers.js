import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import Lesson from "../models/lessons.models.js";

export const createLesson = asyncHandler(async(req,res) => {
    const {chapterId} = req.params
    if(!chapterId){
        throw new ApiError(400,"Chapter ID is required")
    }
    const {title} = req.body
    if(!title){
        throw new ApiError(400,"Lesson title is required")
    }
    const lesson = await Lesson.create({
        title,
        chapter:chapterId
    })
    if(!lesson){
        throw new ApiError(500,"Error while creating lesson")
    }
    res
      .status(201)
      .json(new ApiResponse(201, "Lesson created successfully", lesson));
})

export const getLessonsByChapter = asyncHandler(async(req,res) => {
    const {chapterId} = req.params
    if(!chapterId){
        throw new ApiError(400,"Chapter ID is required")
    }
    const lessons = await Lesson.find({chapter:chapterId})
    if(!lessons){
        throw new ApiError(404,"No lessons found for this chapter")
    }
    res.status(200).json(new ApiResponse(200,"Lessons fetched succesfully",lessons))
})

export const getLesson = asyncHandler(async(req,res) => {
    const {lessonId} = req.params
    if(!lessonId){
        throw new ApiError(400,"Lesson ID is required")
    }
    const lesson = await Lesson.findById(lessonId)
    if(!lesson){
        throw new ApiError(404,"Lesson not found")
    }
    res.status(200).json(new ApiResponse(200,"Lesson fetched succesfully",lesson    ))
})

export const updateLesson = asyncHandler(async(req,res) => {
    const {lessonId} = req.params
    if(!lessonId){
        throw new ApiError(400,"Lesson ID is required")
    }
    const {title} = req.body
    if(!title){
        throw new ApiError(400,"Lesson title is required")
    }
    const updateData = {}
    updateData.title = title

    const lesson = await Lesson.findByIdAndUpdate(lessonId,updateData,{new:true})
    if(!lesson){
        throw new ApiError(500,"Error while updating lesson")
    }
    res.status(200).json(new ApiResponse(200,"Lesson updated successfully",lesson))
})

export const deleteLesson = asyncHandler(async(req,res) => {
    const {lessonId} = req.params
    if(!lessonId){
        throw new ApiError(400,"Lesson ID is required")
    }
    const lesson = await Lesson.findByIdAndDelete(lessonId)
    if(!lesson){
        throw new ApiError(404,"No lesson found with given lessonId")
    }   
    res.status(200).json(new ApiResponse(200,"Lesson deleted successfully",lesson))
})