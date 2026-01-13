import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { Toaster } from "../../utils/toaster";

/* ================= MAIN PAGE ================= */
const MyPurchases = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH COURSES + PROGRESS ================= */
  useEffect(() => {
    if (!user?.enrolledCourses?.length) {
      setLoading(false);
      return;
    }

    const fetchPurchasedCourses = async () => {
      console.log(user.enrolledCourses)
      try {
        setLoading(true);

        const results = await Promise.all(
          user.enrolledCourses.map(async ({ courses: courseId }) => {
            /* === Course === */
            const courseRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/courses/${courseId}`,
              { withCredentials: true }
            );
            console.log(courseRes)
            /* === Chapters === */
            const chapterRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/chapters/${courseId}/all`,
              { withCredentials: true }
            );

            const chapters = chapterRes.data.data || [];

            /* === Lessons per Chapter === */
            const lessonResponses = await Promise.all(
              chapters.map((chapter) =>
                axios.get(
                  `${import.meta.env.VITE_BACKEND_URL}/api/v1/lessons/${chapter._id}/all`,
                  { withCredentials: true }
                )
              )
            );

            let totalLessons = 0;
            lessonResponses.forEach((res) => {
              totalLessons += res.data.data?.length || 0;
            });

            /* === Progress === */
            const progressRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/course-progress/course/${courseId}`,
              { withCredentials: true }
            );

            const completedLessons =
              progressRes.data.data?.courseProgress || 0;

            const progressPercent =
              totalLessons === 0
                ? 0
                : Math.round(
                    (completedLessons / totalLessons) * 100
                  );

            return {
              ...courseRes.data.data,
              totalLessons,
              completedLessons,
              progressPercent,
            };
          })
        );
        setCourses(results);
      } catch (error) {
        console.log(error)
        Toaster("Failed to load purchased courses", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, [user]);

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 max-md:px-4">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          My Purchases
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Continue learning from where you left off
        </p>
      </div>

      {/* COURSES GRID */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
          {courses.map((course) => (
            <PurchasedCourseCard
              key={course._id}
              course={course}
              onContinue={() =>
                navigate(
                  `/learn/courses/${course._id}/lecture`
                )
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

/* ================= COURSE CARD ================= */
const PurchasedCourseCard = ({ course, onContinue }) => {
  const {
    title,
    description,
    courseImage,
    totalLessons,
    completedLessons,
    progressPercent,
    createdAt,
  } = course;

  return (
    <div className="overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition">
      {/* IMAGE */}
      <div className="h-44 w-full">
        <img
          src={courseImage}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* BODY */}
      <div className="p-5">
        <h3 className="line-clamp-2 text-base font-semibold text-gray-900">
          {title}
        </h3>

        <p className="mt-1 line-clamp-1 text-sm text-gray-500">
          {description}
        </p>

        {/* PROGRESS */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {completedLessons}/{totalLessons} lessons completed
            </span>
            <span className="font-medium text-gray-700">
              {progressPercent}%
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onContinue}
          className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          Continue Learning →
        </button>
      </div>

      {/* FOOTER */}
      <div className="border-t px-5 py-3 text-xs text-gray-500">
        Enrolled on{" "}
        {new Date(createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>
    </div>
  );
};

/* ================= EMPTY STATE ================= */
const EmptyState = () => (
  <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
    <h3 className="text-sm font-semibold text-gray-900">
      No purchases yet
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      Once you enroll in a course, it will appear here.
    </p>
  </div>
);

export default MyPurchases;
