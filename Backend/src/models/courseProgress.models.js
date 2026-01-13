import { createSchema } from "./baseSchema.models.js";
import mongoose from "mongoose";
const materialProgressSchema = createSchema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const courseProgressSchema = createSchema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  materials: [materialProgressSchema],
  courseProgress: {
    type: Number,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
});

courseProgressSchema.pre("save", function (next) {
  if (this.materials.length > 0) {
    const completed = this.materials.filter(
      (m) => m.isCompleted
    ).length;

    this.courseProgress = Math.round(
      (completed / this.materials.length) * 100
    );

    this.isCompleted = this.courseProgress === 100;
  }
  next();
});

courseProgressSchema.methods.updateLastAccessed = function () {
  this.lastAccessed = Date.now();
  return this.save({ validateBeforeSave: false });
};

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

export default CourseProgress;