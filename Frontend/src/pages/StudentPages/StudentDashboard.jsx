import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { Toaster } from "../../utils/toaster";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH COURSES + LESSONS + PROGRESS ================= */
  useEffect(() => {
    if (!user?.enrolledCourses?.length) {
      setLoading(false);
      return;
    }

    // ✅ ONLY VALID COURSE IDS
    const validCourseIds = user.enrolledCourses
      .map((e) => e?.courses)
      .filter((id) => typeof id === "string" && id.length === 24);

    if (!validCourseIds.length) {
      setLoading(false);
      return;
    }

    const fetchDashboardCourses = async () => {
      try {
        setLoading(true);
        
        const results = await Promise.all(
          validCourseIds.map(async (courseId) => {
            /* === COURSE === */
            const courseRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/courses/${courseId}`,
              { withCredentials: true }
            );

            /* === CHAPTERS === */
            const chapterRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/chapters/${courseId}/all`,
              { withCredentials: true }
            );

            const chapters = chapterRes.data.data || [];

            /* === LESSONS PER CHAPTER === */
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

            /* === COURSE PROGRESS === */
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
        
        Toaster(
          "Failed to load your dashboard courses",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardCourses();
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
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500 max-w-2xl">
          Continue learning from where you left off.
        </p>
      </div>

      {/* COURSES */}
      <h2 className="mb-4 text-lg font-medium text-gray-900">
        Active courses
      </h2>

      {courses.length ? (
        <div className="space-y-5">
          {courses.map((course) => (
            <div
              key={course._id}
              className="
                rounded-2xl
                border border-gray-200
                bg-white
                p-6
                flex
                items-center
                justify-between
                gap-6
                hover:shadow-sm
                transition
                max-md:flex-col
                max-md:items-start
              "
            >
              {/* LEFT */}
              <div className="flex-1 space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  {course.title}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2">
                  {course.description}
                </p>

                {/* PROGRESS */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>
                      {course.completedLessons}/
                      {course.totalLessons} lessons
                    </span>
                    <span className="font-medium text-gray-700">
                      {course.progressPercent}%
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${course.progressPercent}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() =>
                  navigate(
                    `/learn/courses/${course._id}/lecture`
                  )
                }
                className="
                  shrink-0
                  rounded-xl
                  border border-blue-600
                  px-6 py-2.5
                  text-sm
                  font-medium
                  text-blue-600
                  hover:bg-blue-600
                  hover:text-white
                  transition
                  max-md:w-full
                "
              >
                Continue
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

/* ================= EMPTY STATE ================= */
const EmptyState = () => (
  <div className="mt-12 rounded-2xl bg-white border p-6 text-center">
    <h3 className="text-sm font-semibold text-gray-900">
      No active courses
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      Enroll in a course to begin learning.
    </p>

    <Link
      to="/learn/courses"
      className="
        inline-block
        mt-4
        rounded-xl
        bg-blue-600
        px-6 py-2.5
        text-sm
        font-medium
        text-white
        hover:bg-blue-700
        transition
      "
    >
      Browse courses
    </Link>
  </div>
);

export default StudentDashboard;
