import express from "express"

import { getCourseProgress, updateMaterialProgress } from "../controllers/courseProgress.controllers.js"
import { isEmailVerified, isEnrolled, isLoggedIn } from "../middleware/auth.middleware.js"

const router = express.Router()

router.patch("/material/:materialId",isLoggedIn,isEmailVerified,isEnrolled, updateMaterialProgress)
router.get("/course/:courseId",isLoggedIn,isEmailVerified,isEnrolled, getCourseProgress)

export default router;