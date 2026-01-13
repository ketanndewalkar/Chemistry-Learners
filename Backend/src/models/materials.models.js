import mongoose from "mongoose";
import { AvailableMaterialTypes } from "../utils/constants.js";
import { createSchema } from "./baseSchema.models.js";

const courseMaterialSchema = createSchema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required:true
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    materialType: {
      type: String,
      enum: AvailableMaterialTypes,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: [true, "Material URL is required"],
      trim: true,
      select:false,
    },
    isPreview: {
      type:Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const courseMaterial = mongoose.model("Material", courseMaterialSchema);

export default courseMaterial;
