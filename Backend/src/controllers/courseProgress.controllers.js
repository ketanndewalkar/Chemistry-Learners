import CourseProgress from "../models/courseProgress.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

import { asyncHandler } from "../utils/async-handler.js";

export const updateMaterialProgress = asyncHandler(async (req, res) => {
  const { materialId } = req.params;
  const { courseId, isCompleted } = req.body;
  const userId = req.user._id;

  if (!courseId) {
    throw new ApiError(400, "courseId is required");
  }

  let courseProgress = await CourseProgress.findOne({
    user: userId,
    course: courseId,
  });

  if (!courseProgress) {
    courseProgress = await CourseProgress.create({
      user: userId,
      course: courseId,
      materials: [],
    });
  }

  const index = courseProgress.materials.findIndex(
    (m) => m.material.toString() === materialId
  );

  if (index > -1) {
    courseProgress.materials[index].isCompleted = isCompleted;
  } else {
    courseProgress.materials.push({
      user: userId,
      material: materialId,
      isCompleted,
    });
  }

  await courseProgress.save();

  res
    .status(200)
    .json(new ApiResponse(200, courseProgress, "Material progress updated"));
});

export const getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  const progress = await CourseProgress.findOne({
    user: userId,
    course: courseId,
  }).populate("materials.material");

  if (!progress) {
    return res.status(200).json(
      new ApiResponse(200, {
        courseProgress: 0,
        isCompleted: false,
        totalMaterials: 0,
        completedMaterials: 0,
        materials: [],
      })
    );
  }

  await progress.updateLastAccessed();

  res.status(200).json(
    new ApiResponse(200, {
      courseProgress: progress.courseProgress,
      isCompleted: progress.isCompleted,
      totalMaterials: progress.materials.length,
      completedMaterials: progress.materials.filter((m) => m.isCompleted)
        .length,
      materials: progress.materials,
    })
  );
});
