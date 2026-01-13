import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDb from "./src/db/db.js";
import { errorHandler } from "./src/middleware/errors.middleware.js";

//import all routes
import healthRoutes from "./src/routes/health.routes.js"
import authRoutes from "./src/routes/auth.routes.js"
import userRoutes from "./src/routes/user.routes.js"
import courseRoutes from "./src/routes/course.routes.js"
import chapterRoutes from "./src/routes/chapter.routes.js";
import lessonRoutes from "./src/routes/lesson.routes.js"; 
import materialRoutes from "./src/routes/materials.routes.js";
import freeMaterialsRoutes from "./src/routes/freeMaterials.routes.js";
import courseProgressRoutes from "./src/routes/courseProgress.routes.js";
import enrollmentRoutes from "./src/routes/enrollment.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";

const app = express();

dotenv.config();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET","POST","PUT","DELETE","PATCH"],
  credentials: true,
}))
app.use(cookieParser())

const PORT = process.env.PORT;

// All routes Structure
app.use('/api/v1/health', healthRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/courses',courseRoutes)
app.use('/api/v1/chapters',chapterRoutes)
app.use('/api/v1/lessons',lessonRoutes)
app.use('/api/v1/materials',materialRoutes)
app.use('/api/v1/free-materials',freeMaterialsRoutes)
app.use('/api/v1/course-progress',courseProgressRoutes)
app.use('/api/v1/enrollments', enrollmentRoutes)
app.use('/api/v1/payments', paymentRoutes);


app.use(errorHandler)
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`);
  });
});
