import express from "express";
import { isAllowed, isEmailVerified, isEnrolled, isLoggedIn } from "../middleware/auth.middleware.js";
import { createMaterial,getMaterial,getlessonMaterials,updateMaterial,deleteMaterial,accessMaterial } from "../controllers/materials.controllers.js";
import upload from "../utils/multer.js";


const router = express.Router()

router.post("/:lessonId",isLoggedIn,isEmailVerified,isAllowed("admin"),upload.single("url"),createMaterial)
router.get("/:lessonId",isLoggedIn,isEmailVerified,getlessonMaterials)
router.get("/material/:materialId",isLoggedIn,isEmailVerified,getMaterial)
router.patch("/:materialId",isLoggedIn,isEmailVerified,isAllowed("admin"),upload.single("url"),updateMaterial)
router.delete("/:materialId",isLoggedIn,isEmailVerified,isAllowed("admin"),deleteMaterial)
router.get("/access/:materialId",isLoggedIn,isEmailVerified,isEnrolled,accessMaterial)

export default router;
