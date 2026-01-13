import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import Chapter from "../models/chapters.models.js";

export const createChapter = asyncHandler(async (req, res) => {
  const { title, quizLink } = req.body;
  const { courseId } = req.params;
  if (!title) {
    throw new ApiError(400, "Chapter title is required");
  }
  if (!courseId) {
    throw new ApiError(400, "Course ID is required");
  }
  const chapter = await Chapter.create({
    title,
    course: courseId,
    quizLink,
  });
  if (!chapter) {
    throw new ApiError(500, "Error while creating Chapter");
  }
  res
    .status(201)
    .json(new ApiResponse(201, "Chapter created successfully", chapter));
});

export const getChaptersByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  if (!courseId) {
    throw new ApiError(400, "CourseId is required");
  }
  const chapters = await Chapter.find({ course: courseId });
  res
    .status(200)
    .json(new ApiResponse(200, "All chapters fetched Successfully", chapters));
});

export const getChapter = asyncHandler(async (req, res) => {
  const { chapterId } = req.params;
  if (!chapterId) {
    throw new ApiError(400, "ChapterId is required");
  }
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    throw new ApiError(404, "Chapter not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Chapter fetched Succesfully", chapter));
});

export const updateChapter = asyncHandler(async (req, res) => {
  const { chapterId } = req.params;
  const { title, quizLink } = req.body;
  if (!chapterId) {
    throw new ApiError(400, "ChapterId is required");
  }
  const updateData = {};

  if (title !== undefined) updateData.title = title;
  if (quizLink !== undefined) updateData.quizLink = quizLink;

  const chapter = await Chapter.findByIdAndUpdate(chapterId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!chapter) {
    throw new ApiError(404, "Chapter not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Chapter updated Successfully", chapter));
});

export const deleteChapter = asyncHandler(async(req,res) => {
    const { chapterId } = req.params;   
    if (!chapterId) {
      throw new ApiError(400, "ChapterId is required");
    }
    const chapter = await Chapter.findByIdAndDelete(chapterId);
    if (!chapter) {
      throw new ApiError(404, "Chapter not found");
    }   
    res
      .status(200)
      .json(new ApiResponse(200, "Chapter deleted Successfully", chapter));
})
