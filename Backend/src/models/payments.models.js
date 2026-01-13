import mongoose from "mongoose";
import { createSchema } from "./baseSchema.models.js";

const paymentSchema = createSchema({
   student : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
   },
   course : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true, 
   },
   amount : {
    type: Number,
    required: true
   },
   paymentDate : { 
    type: Date,
    default: Date.now
   },
   orderId : {
      type:String,
      required: true,
      unique: true
   },
   paymentSignature:{
      type:String,   
      default:null
   }    
})

const Payment = mongoose.model("Payment", paymentSchema)

export default Payment