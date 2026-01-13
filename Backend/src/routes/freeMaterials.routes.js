import express from "express";
import { isAllowed, isEmailVerified, isLoggedIn } from "../middleware/auth.middleware.js";
import { deleteMaterial, getAllFreeMaterials, getMaterialById, uploadFreeMaterial } from "../controllers/freeMaterials.controllers.js";
import upload from "../utils/multer.js";

const router = express.Router();
router.post("/",isLoggedIn,isEmailVerified,isAllowed("admin"),upload.single("url"),uploadFreeMaterial)
router.get("/",getAllFreeMaterials)
router.get("/:materialId",getMaterialById)
router.delete("/:materialId",isLoggedIn,isEmailVerified,isAllowed("admin"),deleteMaterial)

export default router;