import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import LectureSidebar from "../../../pages/StudentPages/LectureSidebar";
import StudentNavbar from "../Navbar/StudentNavbar";
import { useAuth } from "../../../Context/AuthContext";
import { Toaster } from "../../../utils/toaster";

const LectureLayout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [lessonsMap, setLessonsMap] = useState({});
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(null);

  /* ================= CHECK ENROLLMENT ================= */
  useEffect(() => {
    if (authLoading) return;

    if (!user || !user?.enrolledCourses) {
      setIsPurchased(false);
      return;
    }

    const purchased = user.enrolledCourses.some(
      (e) => String(e?.courses) === String(courseId)
    );

    setIsPurchased(purchased);
  }, [authLoading, user, courseId]);

  /* ================= FETCH COURSE DATA ================= */
  useEffect(() => {
    if (isPurchased === null) return;

    if (!isPurchased) {
      Toaster("Course Not Purchased", "error");
      navigate(`/learn/courses/${courseId}`, { replace: true });
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      try {
        /* === Course === */
        const courseRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/courses/${courseId}`,
          { withCredentials: true }
        );

        /* === Chapters === */
        const chapterRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/chapters/${courseId}/all`,
          { withCredentials: true }
        );

        const chaptersData = chapterRes.data.data || [];

        /* === Lessons per Chapter === */
        const lessonResponses = await Promise.all(
          chaptersData.map((chapter) =>
            axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/lessons/${chapter._id}/all`,
              { withCredentials: true }
            )
          )
        );

        const lessonMap = {};
        lessonResponses.forEach((res, idx) => {
          lessonMap[chaptersData[idx]._id] = res.data.data || [];
        });

        /* === Progress === */
        const progressRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/course-progress/course/${courseId}`,
          { withCredentials: true }
        );

        setCourse(courseRes.data.data);
        setChapters(chaptersData);
        setLessonsMap(lessonMap);
        setProgressMap(progressRes.data.data || {});
      } catch (error) {
        console.error(error);
        Toaster("Failed to load course content", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [isPurchased, courseId, navigate]);

  /* ================= LOADER ================= */
  if (loading || authLoading) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-dvh bg-[#F7FAFC] overflow-hidden">
      {/* ===== SIDEBAR ===== */}
      <LectureSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        course={course}
        chapters={chapters}
        lessonsMap={lessonsMap}
        progressMap={progressMap}
      />

      {/* ===== MAIN ===== */}
      <div className="flex flex-1 flex-col">
        <StudentNavbar
          onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-6 max-md:p-4">
          <Outlet context={{course,}}/>
        </main>
      </div>
    </div>
  );
};

export default LectureLayout;
