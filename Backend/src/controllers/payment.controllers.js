import crypto from "crypto"
import {asyncHandler} from "../utils/async-handler.js" 
import {ApiError} from "../utils/api-error.js"
import {ApiResponse} from "../utils/api-response.js"
import Payment from "../models/payments.models.js"
import Razorpay from "razorpay";
import { enrollInCourse } from "../utils/enroll.js";


const razorpay = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET
})
console.log("Razorpay Instance Created:", razorpay);    

export const createOrder = asyncHandler(async(req,res) => {
    const {amount} = req.body;
    const {courseId} = req.params;
    if(!amount || amount <= 0){
      throw new ApiError(400,"Invalid amount")
    }
    if(!courseId){
      throw new ApiError(400,"Course ID is required")
    }
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${req.user.name}_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    const payment = await Payment.create({
        student: req.user._id,
        course: courseId,
        amount: amount,
        orderId: order.id
    })
    return res.status(201).json(new ApiResponse(201,"Order created successfully",payment))
})

export const verifyPayment = asyncHandler(async(req,res) => {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
      throw new ApiError(400,"All payment details are required")
    }
    const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');
    if(generated_signature !== razorpay_signature){
      throw new ApiError(400,"Invalid payment signature")
    }
    const payment = await Payment.findOne({orderId: razorpay_order_id});
    if(!payment){
      throw new ApiError(404, "Payment not found");
    }
    if(payment.paymentSignature){
      throw new ApiError(400, "Payment already verified");
    }
    payment.paymentSignature = razorpay_signature;
    await payment.save();
    const enrollment = await enrollInCourse(payment.student, payment.course, payment._id, "enrolled");
    console.log(enrollment,"error")
    res.status(200).json(new ApiResponse(200, "Payment verified successfully and student enrolled", enrollment));
})