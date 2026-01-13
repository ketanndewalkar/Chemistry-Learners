import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiBookOpen,
  FiInfo,
  FiEdit3,
} from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";
import { Oval } from "react-loader-spinner";
import { Toaster } from "../../utils/toaster";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/ui/BackButton";

const EditCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseFees: "",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  /* ===== FETCH COURSE DETAILS ===== */
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/courses/${courseId}`,
          { withCredentials: true }
        );

        const course = res.data.data;

        setFormData({
          title: course.title || "",
          description: course.description || "",
          courseFees: course.courseFees || "",
        });
      } catch (err) {
        Toaster("Failed to load course data", "error");
        navigate(-1);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  /* ===== INPUT CHANGE ===== */
 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};


  /* ===== UPDATE COURSE ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.courseFees) {
      Toaster("Title, description and fees are required", "error");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      courseFees: Number(formData.courseFees),
    };

    try {
      setLoading(true);

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/courses/${courseId}`,
        payload,
        { withCredentials: true }
      );

      Toaster("Course updated successfully", "success");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update course";

      Toaster(message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto px-6 py-3 space-y-8">
      <div className="h-[clamp(1rem,2vw,2rem)] flex items-center">
          <BackButton to={`/admin/courses`}/>
        </div>
      {/* ===== HEADER ===== */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Course
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Update course details and manage its structure
          </p>
        </div>

        {/* EDIT STRUCTURE */}
        <button
          onClick={() =>
            navigate(`/admin/courses/${courseId}/edit-content-structure`)
          }
          className="
            inline-flex items-center gap-2
            px-4 py-2
            text-sm font-medium
            border border-gray-300
            rounded-lg
            text-gray-700
            hover:bg-gray-50
          "
        >
          <FiEdit3 />
          Edit Course Structure
        </button>
      </div>

      {/* ===== LAYOUT ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="
            lg:col-span-2
            bg-white
            rounded-2xl
            border border-gray-200
            shadow-sm
            p-[clamp(1.5rem,2vw,2.2rem)]
            space-y-8
          "
        >
          {/* === BASIC INFO === */}
          <section>
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Course Information
            </h3>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Course Title
                </label>
                <div className="relative">
                  <FiBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="
                      w-full pl-10 pr-4 py-2.5
                      rounded-lg
                      border border-gray-300
                      focus:ring-2 focus:ring-blue-500
                    "
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Course Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="
                    w-full p-3
                    rounded-lg
                    border border-gray-300
                    resize-none
                    focus:ring-2 focus:ring-blue-500
                  "
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Course Fees
                </label>
                <div className="relative">
                  <MdCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="courseFees"
                    value={formData.courseFees}
                    onChange={handleChange}
                    className="
                      w-full pl-10 pr-4 py-2.5
                      rounded-lg
                      border border-gray-300
                      focus:ring-2 focus:ring-blue-500
                    "
                  />
                </div>
              </div>
            </div>
          </section>

          {/* === ACTION === */}
          <div className="flex justify-end">
            <button
              disabled={loading}
              className="
                px-6 py-2.5
                bg-blue-600
                text-white
                rounded-lg
                font-medium
                hover:bg-blue-700
                transition
                disabled:opacity-60
                flex items-center justify-center gap-2
                min-w-[170px]
              "
            >
              {loading ? (
                <>
                  <Oval
                    height={18}
                    width={18}
                    color="#ffffff"
                    secondaryColor="#c7d2fe"
                    strokeWidth={4}
                    strokeWidthSecondary={4}
                  />
                  <span>Updating…</span>
                </>
              ) : (
                "Update Course"
              )}
            </button>
          </div>
        </form>

        {/* ================= INFO ================= */}
        <aside className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <div className="flex items-start gap-2">
              <FiInfo className="text-blue-500 mt-0.5" />
              <p className="text-sm text-blue-700">
                Update course details carefully. Changes will reflect
                immediately for enrolled students.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EditCoursePage;
