import express from "express";
import { isAllowed, isEmailVerified, isLoggedIn } from "../middleware/auth.middleware.js";
import { createChapter, deleteChapter, getChapter,  getChaptersByCourse, updateChapter } from "../controllers/chapter.controllers.js";

const router = express.Router();

router.post("/:courseId",isLoggedIn,isEmailVerified,isAllowed("admin"),createChapter);
router.get("/:courseId/all",isLoggedIn,isEmailVerified,getChaptersByCourse);
router.get("/:chapterId",isLoggedIn,isEmailVerified,getChapter);
router.patch("/:chapterId",isLoggedIn,isEmailVerified,isAllowed("admin"),updateChapter);
router.delete("/:chapterId",isLoggedIn,isEmailVerified,isAllowed("admin"),deleteChapter);

export default router;