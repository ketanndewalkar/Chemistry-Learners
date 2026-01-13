import express from "express";
import { isAllowed, isEmailVerified, isLoggedIn } from "../middleware/auth.middleware.js";
import { createCourse, deleteCourse, enrollInCourse, getCourse, getCourses, updateCourse, updateCourseStatus } from "../controllers/course.controllers.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/",isLoggedIn,isEmailVerified,isAllowed("admin"),upload.single("image"),createCourse);
router.get ("/",isLoggedIn,getCourses);
router.get ("/:courseId",isLoggedIn,getCourse);
router.patch ("/:courseId",isLoggedIn,isEmailVerified,isAllowed("admin"),updateCourse);
router.delete ("/:courseId",isLoggedIn,isEmailVerified,isAllowed("admin"),deleteCourse);
router.patch("/:courseId/publish",isLoggedIn,isEmailVerified,isAllowed("admin"),updateCourseStatus
);
router.post("/:courseId/enroll",isLoggedIn,isEmailVerified,enrollInCourse);

export default router