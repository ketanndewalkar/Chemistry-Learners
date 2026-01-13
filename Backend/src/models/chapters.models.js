import mongoose from "mongoose";
import { createSchema } from "./baseSchema.models.js";

const chapterSchema = createSchema({
  title: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  quizLink: { type: String },

},{timestamps:true});

const Chapter = mongoose.model("Chapter", chapterSchema);

export default Chapter;