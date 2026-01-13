import express from 'express';
import {createOrder, verifyPayment} from "../controllers/payment.controllers.js"
import { isEmailVerified, isLoggedIn } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/create-order/:courseId",isLoggedIn,isEmailVerified, createOrder);
router.post("/verify-payment",isLoggedIn,isEmailVerified,verifyPayment);


export default router;