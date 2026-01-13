import mongoose from "mongoose";
import { createSchema } from "./baseSchema.models.js";

const lessonSchema = createSchema(
  {
    title: { type: String, required: true },
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
