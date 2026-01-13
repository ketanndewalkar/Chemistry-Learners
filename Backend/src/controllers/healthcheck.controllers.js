import {asyncHandler} from "../utils/async-handler.js"
import {ApiResponse} from "../utils/api-response.js"

export const health = asyncHandler(async (req,res) => {
   res.status(200).json(new ApiResponse(200,null,"Healthcheck route"))
})