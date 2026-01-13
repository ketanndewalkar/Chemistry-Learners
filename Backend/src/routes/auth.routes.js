import express from "express"
import { emailVerification, logOut, refreshAccessToken, resendEmailVerification, resetPassword, signin, signup } from "../controllers/auth.controllers.js"
import { isLoggedIn } from "../middleware/auth.middleware.js"



const router = express.Router()

router.post('/signup',signup)
router.post('/signin',signin)

router.get('/logout',isLoggedIn,logOut)
router.get('/verify/:token',emailVerification)
router.get('/resendemail',isLoggedIn,resendEmailVerification)
router.get('/refreshtoken',refreshAccessToken)
router.post('/reset-password',resetPassword)


export default router