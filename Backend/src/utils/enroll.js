import { asyncHandler } from "./async-handler.js";
import User from "../models/user.models.js";
import Enrollment from "../models/enrollment.models.js";
import Course from "../models/course.models.js";

export const enrollInCourse = asyncHandler(
  async (studentId, courseId, paymentId = null, status) => {
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      return existingEnrollment;
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      payment: paymentId,
      status
    });

    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { enrolledStudents: studentId },
    });
    await User.findByIdAndUpdate(studentId, {
      $addToSet: { enrolledCourses: {
        courses: courseId,
      } },
    });

    return enrollment;
  }
);
