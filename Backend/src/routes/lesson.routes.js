import express from "express";
import { isAllowed, isEmailVerified, isLoggedIn } from "../middleware/auth.middleware.js";

import { createLesson, deleteLesson, getLesson,  getLessonsByChapter, updateLesson } from "../controllers/lesson.controllers.js";

const router = express.Router();    

router.post("/:chapterId",isLoggedIn,isEmailVerified,isAllowed("admin"),createLesson);
router.get("/:chapterId/all",isLoggedIn,isEmailVerified,getLessonsByChapter);
router.get("/:lessonId",isLoggedIn,isEmailVerified,getLesson);
router.patch("/:lessonId",isLoggedIn,isEmailVerified,isAllowed("admin"),updateLesson);
router.delete("/:lessonId",isLoggedIn,isEmailVerified,isAllowed("admin"),deleteLesson);

export default router;