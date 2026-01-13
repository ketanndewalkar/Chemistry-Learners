import express from "express"
import {getEnrollments,getEnrollmentById,getCoursesOfStudent} from "../controllers/enrollment.controller.js"
import { isEmailVerified, isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",isLoggedIn,isEmailVerified,getEnrollments)
router.get("/:enrollmentId",isLoggedIn,isEmailVerified,getEnrollmentById)
router.get("/student/courses",isLoggedIn,isEmailVerified,getCoursesOfStudent)

export default router;