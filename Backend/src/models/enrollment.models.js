import mongoose from "mongoose";
import { AvailableEnrollmentStatus, enrollmentStatusEnum } from "../utils/constants.js";
import { createSchema } from "./baseSchema.models.js";

export const enrollmentSchema = createSchema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    status: {
      type: String,
      enum: AvailableEnrollmentStatus,
      default: enrollmentStatusEnum.PENDING,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
