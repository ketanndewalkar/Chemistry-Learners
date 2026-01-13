import mongoose from "mongoose";
import { createSchema } from "./baseSchema.models.js";
import Chapter from "./chapters.models.js"

const courseSchema = createSchema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseFees: {
      type: Number,
      required: true,
    },
    courseImage: {
      type: String,
    },
    chapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
      },
    ],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    coursePublishedStatus: {
      type: String,
      enum: ["draft", "published", "unlisted"],
      default: "draft",
    },
    totalMaterials: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

courseSchema.pre("save", function (next) {
  if (this.chapters) {
    this.totalMaterials = this.chapters.length;
  }
  next();
});


const Course = mongoose.model("Course", courseSchema);

export default Course;
