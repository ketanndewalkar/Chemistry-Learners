import axios from "axios";
import { useEffect, useState } from "react";
import { FiSearch, FiPlus, FiEdit3, FiTrash2, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/ui/BackButton";
import { Toaster } from "../../utils/toaster";

/* ================= STATUS STYLES ================= */
const statusStyles = {
  draft: "bg-gray-100 text-gray-700 border-gray-200",
  published: "bg-green-100 text-green-700 border-green-200",
  unlisted: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const tabs = [
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "unlisted", label: "Unlisted" },
];

/* ================= COURSE CARD ================= */
const CourseCard = ({ course, onStatusChange, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200/70 rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition">
      {/* IMAGE */}
      <div className="relative h-44">
        <img
          src={course.courseImage}
          alt={course.title}
          className="w-full h-full object-cover"
        />

        <span
          className={`
            absolute top-3 right-3
            px-2.5 py-1 rounded-full
            text-[0.7rem] font-medium border backdrop-blur
            ${statusStyles[course.coursePublishedStatus]}
          `}
        >
          {course.coursePublishedStatus}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-xs text-gray-500 mt-2 line-clamp-1">
          {course.description}
        </p>

        <div className="mt-4 flex justify-between text-xs text-gray-500">
          <span>{course.enrolledStudents.length || 0} students</span>
          <span className="font-medium text-gray-900">
            ₹{course.courseFees}
          </span>
        </div>

        <div className="my-4 h-px bg-gray-200/70" />

        {/* ACTIONS */}
        <div className="flex items-center justify-between gap-3">
          <select
            value={course.coursePublishedStatus}
            onChange={(e) =>
              onStatusChange(course._id, e.target.value)
            }
            className="text-xs px-3 py-1.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 border-gray-200 text-gray-700"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="unlisted">Unlisted</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() =>
                navigate(`/admin/courses/${course._id}/edit`)
              }
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              <FiEdit3 /> Edit
            </button>

            <button
              onClick={() => onDelete(course)}
              className="inline-flex items-center px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("published");
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  /* ===== FILTER ===== */
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  /* ===== STATUS CHANGE ===== */
  const handleStatusChange = async (courseId, newStatus) => {
    const snapshot = [...courses];

    setCourses((prev) =>
      prev
        .map((course) =>
          course._id === courseId
            ? { ...course, coursePublishedStatus: newStatus }
            : course
        )
        .filter((course) =>
          course._id === courseId
            ? newStatus === activeTab
            : true
        )
    );

    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/courses/${courseId}/publish`,
        { coursePublishedStatus: newStatus },
        { withCredentials: true }
      );
    } catch (error) {
      Toaster(
        error.response?.data?.message || "Failed to update status.",
        "error"
      );
      setCourses(snapshot);
    }
  };

  /* ===== DELETE COURSE ===== */
  const confirmDelete = async () => {
    const snapshot = [...courses];
    setDeleting(true);

    setCourses((prev) =>
      prev.filter((c) => c._id !== deleteTarget._id)
    );

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/courses/${deleteTarget._id}`,
        { withCredentials: true }
      );
      setDeleteTarget(null);
    } catch (error) {
      Toaster(
        error.response?.data?.message || "Failed to delete course.",
        "error"
      );
      setCourses(snapshot);
    } finally {
      setDeleting(false);
    }
  };

  /* ===== FETCH COURSES ===== */
  const fetchCourses = async (status) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/courses?status=${status}`,
        { withCredentials: true }
      );
      setCourses(res.data.data);
    } catch (error) {
      Toaster(
        error.response?.data?.message || "Failed to fetch courses.",
        "error"
      );
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(activeTab);
  }, [activeTab]);

  return (
    <div className="p-[clamp(1rem,2vw,2rem)] space-y-8">
      {/* HEADER */}
      <div className="h-[clamp(1rem,2vw,2rem)] flex items-center">
          <BackButton to={`/admin`}/>
        </div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Courses</h1>
          <p className="text-sm text-gray-500">
            Manage and publish your courses
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/courses/new")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          <FiPlus /> Create Course
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white border rounded-xl p-4 border-gray-200 ">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none"
          />
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* LOADER */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
        </div>
      )}

      {/* GRID */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onStatusChange={handleStatusChange}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {!loading && filteredCourses.length === 0 && (
        <div className="text-center text-sm text-gray-500 py-10">
          No courses found
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 space-y-4 relative">
            <button
              onClick={() => setDeleteTarget(null)}
              className="absolute top-3 right-3 text-gray-400"
            >
              <FiX />
            </button>

            <h3 className="font-semibold text-gray-900">
              Delete Course?
            </h3>
            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
