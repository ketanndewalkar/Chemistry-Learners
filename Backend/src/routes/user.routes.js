import express from "express"
import { isLoggedIn } from "../middleware/auth.middleware.js"
import { changePassword, createdCourses, deleteUserProfile, getAllUsers, getEnrolledCourses, getUserProfile, updateUserProfile } from "../controllers/user.controllers.js"

const router = express.Router()

router.get("/profile", isLoggedIn, getUserProfile)
router.patch("/profile", isLoggedIn, updateUserProfile)
router.delete("/profile", isLoggedIn, deleteUserProfile)
router.get("/all", isLoggedIn, getAllUsers)
router.patch("/change-password", isLoggedIn, changePassword)
router.get("/enrolled-courses", isLoggedIn, getEnrolledCourses)
router.get("/created-courses", isLoggedIn, createdCourses)

export default router