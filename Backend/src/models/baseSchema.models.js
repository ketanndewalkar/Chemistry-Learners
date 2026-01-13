import mongoose from "mongoose";
import { istTransform } from "../utils/istTransform.js";

export const createSchema = (definition, options = {}) =>
  new mongoose.Schema(definition, {
    timestamps: true,
    ...options
  }).plugin(istTransform);
