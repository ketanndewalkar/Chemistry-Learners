import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import cloudinary from "cloudinary";
import { uploadPdf } from "../utils/cloudinary.js";
import FreeMaterial from "../models/freeMaterials.models.js";

export const uploadFreeMaterial = asyncHandler(async (req, res) => {
  const { title, description, url, materialType } = req.body;
  if (!title || !materialType) {
    throw new ApiError(400, "Title and Material type are required");
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

  const freeMaterial = await FreeMaterial.create({
    title,
    description,
    materialType,
    url: materialType === "video" ? url : pdfUrl,
    uploadedBy: req.user._id,
  });

  if (!freeMaterial) {
    throw new ApiError(500, "Error while uploading free material");
  }

  res
    .status(201)
    .json(
      new ApiResponse(201, "Free material uploaded successfully", freeMaterial)
    );
});

export const getAllFreeMaterials = asyncHandler(async (req, res) => {
  const freeMaterials = await FreeMaterial.find().populate(
    "uploadedBy",
    "name email"
  );
  if (freeMaterials.length === 0) {
    throw new ApiError(404, "No free material found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, "Free materials fetched successfully", freeMaterials)
    );
});

export const getMaterialById = asyncHandler(async (req, res) => {
  const { materialId } = req.params;
  if (!materialId) {
    throw new ApiError(400, "MaterialId is required");
  }
  const material = await FreeMaterial.findById(materialId);
  if (!material) {
    throw new ApiError(404, "No material found with giiven Id");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Material Fetched Succesfully", material));
});

export const deleteMaterial = asyncHandler(async (req, res) => {
  const { materialId } = req.params;

  if (!materialId) {
    throw new ApiError(400, "MaterialId is required");
  }

  const material = await FreeMaterial.findById(materialId);

  if (!material) {
    throw new ApiError(404, "Material not found");
  }

  if (material.materialType === "pdf") {
    await cloudinary.uploader.destroy(material.url, {
      resource_type: "raw",
      type: "private",
    });
  }
  await FreeMaterial.findByIdAndDelete(materialId);

  res.status(200).json(new ApiResponse(200, "Material deleted successfully"));
});
