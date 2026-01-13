import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import CourseCard from "./CourseCard";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import BackButton from "../../components/ui/BackButton";

const BatchSearchFilters = () => {
  const [Courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredCourses = Courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/courses`,
          { withCredentials: true }
        );
        setCourses(res.data.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Oval
          height={45}
          width={45}
          color="#2563eb"           // blue-600
          secondaryColor="#bfdbfe" // blue-200
          strokeWidth={4}
          strokeWidthSecondary={4}
          visible
        />
        <p className="mt-3 text-sm text-gray-600">
          Loading courses...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-2 py-3 max-md:px-2 max-md:py-2">
      
      {/* ================= FILTER BAR ================= */}
      <div className="mb-8 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4 max-md:gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 max-md:w-full">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search course"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* ================= COURSES GRID ================= */}
      {filteredCourses.length === 0 ? (
        <div className="text-center text-sm text-gray-500 py-12">
          No courses found
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchSearchFilters;
