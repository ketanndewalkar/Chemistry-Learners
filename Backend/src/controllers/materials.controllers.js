import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import courseMaterial from "../models/materials.models.js";
import { uploadPdf } from "../utils/cloudinary.js";
import { getSignedPdfUrl } from "../utils/cloudinarySignedUrl.js";
import Lesson from "../models/lessons.models.js";
import Chapter from "../models/chapters.models.js";
import cloudinary from "cloudinary";
import Enrollment from "../models/enrollment.models.js";

export const createMaterial = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  if (!lessonId) {
    throw new ApiError(400, "LessonId is required");
  }

  const { title, description, materialType, isPreview, url } = req.body;
  if (!title || !materialType) {
    throw new ApiError(400, "Title and materialType both are required");
  }
  if (materialType === "video" && !url) {
    throw new ApiError(400, "Video URL is required for video material type");
  }
  if (req.file == null && materialType === "pdf") {
    throw new ApiError(400, "PDF file is required");
  }
  let pdfUrl;

  if (materialType === "pdf") {
    const result = await uploadPdf(req.file.path);
  

    pdfUrl = result.secure_url;
    if (!pdfUrl) {
      throw new ApiError(500, "Error while uploading PDF");
    }
  }
  const material = await courseMaterial.create({
    lesson: lessonId,
    title,
    description,
    materialType,
    url: materialType === "video" ? url : pdfUrl,
    isPreview,
    uploadedBy: req.user._id,
  });
  if (!material) {
    throw new ApiError(500, "Error while uploading material");
  }
  const safeMaterial = await courseMaterial.findById(material._id);
  res
    .status(201)
    .json(new ApiResponse(201, "Material uploaded Succesfully", safeMaterial));
});

export const getlessonMaterials = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  if (!lessonId) {
    throw new ApiError(400, "LessonId is required");
  }
  const material = await courseMaterial.find({ lesson: lessonId });
  if (!material) {
    throw new ApiError(404, "No materials found for this lesson");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, "Lesson materials fetched successfully", material)
    );
});

export const getMaterial = asyncHandler(async (req, res) => {
  const { materialId } = req.params;
  if (!materialId) {
    throw new ApiError(400, "MaterialId is required");
  }
  const material = await courseMaterial.findById(materialId);
  if (!material) {
    throw new ApiError(404, "Material not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Material fetched successfully", material));
});

export const updateMaterial = asyncHandler(async (req, res) => {
  const { materialId } = req.params;
  if (!materialId) {
    throw new ApiError(400, "MaterialId is required");
  }
  const { title, description, materialType, isPreview, url } = req.body;
  const material = await courseMaterial.findById(materialId);
  if (!material) {
    throw new ApiError(404, "Material not found");
  }
  let pdfUrl;

  if (materialType === "pdf" && req.file) {
    const result = await uploadPdf(req.file.path);

    pdfUrl = result.public_id;
    if (!pdfUrl) {
      throw new ApiError(500, "Error while uploading PDF");
    }
    material.url = pdfUrl;
  }
  if (materialType === "video" && url) {
    material.url = url;
  }
  material.title = title || material.title;
  material.description = description || material.description;
  material.materialType = materialType || material.materialType;
  material.isPreview = isPreview !== undefined ? isPreview : material.isPreview;

  await material.save();
  const safeMaterial = await courseMaterial.findById(material._id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Material updated successfully", safeMaterial));
});

export const deleteMaterial = asyncHandler(async (req, res) => {
  const { materialId } = req.params;

  if (!materialId) {
    throw new ApiError(400, "MaterialId is required");
  }

  const material = await courseMaterial.findById(materialId).select("+url");

  if (!material) {
    throw new ApiError(404, "Material not found");
  }

  if (material.materialType === "pdf") {
    await cloudinary.uploader.destroy(material.url, {
      resource_type: "raw",
      type: "private",
    });
  }
  await courseMaterial.findByIdAndDelete(materialId);

  res.status(200).json(new ApiResponse(200, "Material deleted successfully"));
});

export const accessMaterial = asyncHandler(async (req, res) => {
  const { materialId } = req.params;

  if (!materialId) {
    throw new ApiError(400, "MaterialId is required");
  }

  const material = await courseMaterial
    .findById(materialId)
    .select("+url isPreview materialType lesson");

  if (!material) {
    throw new ApiError(404, "Material not found");
  }

  if (!material.isPreview) {
    const lesson = await Lesson.findById(material.lesson);

    if (!lesson) {
      throw new ApiError(404, "Lesson not found");
    }

    const chapter = await Chapter.findById(lesson.chapter);
    if (!chapter) {
      throw new ApiError(404, "Chapter not found");
    }

    const isEnrolled = await Enrollment.findOne({
      student: req.user._id,
      course: chapter.course,
    });

    if (!isEnrolled && req.user.role !== "admin") {
      throw new ApiError(403, "Enroll to access this content");
    }
  }

  if (material.materialType === "pdf" || material.materialType === "video") {
    res
      .status(200)
      .json(
        new ApiResponse(200, "Material access granted", { url: material.url })
      );
  }

  throw new ApiError(400, "Invalid material type");
});
