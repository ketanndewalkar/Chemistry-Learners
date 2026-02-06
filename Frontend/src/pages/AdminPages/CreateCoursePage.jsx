import axios from "axios";
import { useState } from "react";
import {
  FiUpload,
  FiBookOpen,
  FiInfo,
} from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";
import { Oval } from "react-loader-spinner";
import { Toaster } from "../../utils/toaster";
import { useNavigate } from "react-router-dom";

const CreateCoursePage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseFees: "",
    image: null,
  });

  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.courseFees ||
      !formData.image
    ) {
      Toaster("All fields are required", "error");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("description", formData.description.trim());
    payload.append("courseFees", Number(formData.courseFees));
    payload.append("image", formData.image);

    try {
      setLoading(true);

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/courses`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      
      const createdCourse = res.data.data;

      Toaster("Course created successfully", "success");

      navigate(`/admin/courses/${createdCourse._id}/edit`);
    } catch (err) {
        Toaster(
          err.response?.data?.message || "Failed to create course. Please try again.",
          "error"
        );
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create course";

      Toaster(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-[clamp(1rem,2vw,2rem)] max-w-7xl mx-auto">
      {/* ===== HEADER ===== */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Create Course
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Provide structured details to publish a new course
        </p>
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
                    required
                    onChange={handleChange}
                    className="
                      w-full pl-10 pr-4 py-2.5
                      rounded-lg
                      border border-gray-300
                      focus:ring-2 focus:ring-blue-500
                    "
                    placeholder="Eg. Introduction to Organic Chemistry"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Course Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  onChange={handleChange}
                  className="
                    w-full p-3
                    rounded-lg
                    border border-gray-300
                    resize-none
                    focus:ring-2 focus:ring-blue-500
                  "
                  placeholder="Describe what students will learn..."
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
                    required
                    onChange={handleChange}
                    className="
                      w-full pl-10 pr-4 py-2.5
                      rounded-lg
                      border border-gray-300
                      focus:ring-2 focus:ring-blue-500
                    "
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* === IMAGE UPLOAD === */}
          <section>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Course Image
            </h3>

            <label
              className="
                flex flex-col items-center justify-center
                border-2 border-dashed border-gray-300
                rounded-xl
                p-6
                text-sm text-gray-500
                cursor-pointer
                hover:border-blue-500 hover:bg-blue-50
                transition
              "
            >
              <FiUpload className="text-2xl mb-2" />
              <p>Upload course thumbnail</p>
              <span className="text-xs text-gray-400 mt-1">
                Recommended size: 1200×630
              </span>
              <input
                type="file"
                accept="image/*"
                name="image"
                hidden
                required
                onChange={handleChange}
              />
            </label>
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
                min-w-[160px]
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
                    ariaLabel="loading"
                  />
                  <span>Creating…</span>
                </>
              ) : (
                "Create Course"
              )}
            </button>
          </div>
        </form>

        {/* ================= PREVIEW / INFO ================= */}
        <aside className="space-y-6">
          {/* PREVIEW */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Preview
            </h4>

            <div className="rounded-xl border overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="h-40 bg-gray-50 flex items-center justify-center text-sm text-gray-400">
                  Course image preview
                </div>
              )}

              <div className="p-3">
                <p className="font-medium text-gray-900">
                  {formData.title || "Course title"}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {formData.description ||
                    "Course description will appear here"}
                </p>
              </div>
            </div>
          </div>

          {/* INFO */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <div className="flex items-start gap-2">
              <FiInfo className="text-blue-500 mt-0.5" />
              <p className="text-sm text-blue-700">
                Ensure the title and description are clear and engaging.
                This helps improve course discoverability and student
                engagement.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateCoursePage;
