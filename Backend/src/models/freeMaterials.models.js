import mongoose from "mongoose";

import { createSchema } from "./baseSchema.models.js";

const freeMaterialSchema = createSchema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    materialType:{
      type: String,
      enum: ["video","pdf"],
      default: "pdf",
      required: [true, "Material type is required"],
    },
    url: {
      type: String,
      required: [true, "Material URL is required"],
      trim: true,
    },
    resourceType: {
      type: String,
      default: "free",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const FreeMaterial = mongoose.model("FreeMaterial", freeMaterialSchema);

export default FreeMaterial;
