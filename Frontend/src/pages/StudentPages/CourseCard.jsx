import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const {
    _id,
    title,
    description,
    courseFees,
    courseImage,
    enrolledStudents = [],
    chapters = [],
    totalMaterials,
    createdAt,
  } = course;

  const statusColor = {
    published: "bg-green-100 text-green-700",
    draft: "bg-yellow-100 text-yellow-700",
    unlisted: "bg-gray-200 text-gray-700",
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md">
      {/* ================= IMAGE ================= */}
      <div className="relative h-44 w-full">
        <img
          src={courseImage || "/course-placeholder.jpg"}
          alt={title}
          className="h-full w-full object-cover"
        />

      </div>

      {/* ================= BODY ================= */}
      <div className="p-5 max-md:p-4">
        {/* Title */}
        <h3 className="line-clamp-1 text-base font-semibold text-gray-900 max-md:text-sm ">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-1 line-clamp-2 text-sm text-gray-500 max-md:text-xs">
          {description}
        </p>

        {/* Meta */}
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
          <span>📘 {chapters.length} chapters</span>
          <span>📂 {totalMaterials} materials</span>
          <span>👥 {enrolledStudents.length} enrolled</span>
        </div>

        {/* Price + CTA */}
        <div className="mt-5 flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900 max-md:text-base">
            ₹{courseFees.toLocaleString()}
          </div>

          <Link to={`/learn/courses/${_id}`} className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 max-md:px-4 max-md:py-2 max-md:text-xs cursor-pointer">
            View course
          </Link>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex items-center justify-between border-t px-5 py-3 text-xs text-gray-500 max-md:px-4">
        <span>
          Created on{" "}
          {new Date(createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>

        
      </div>
    </div>
  );
};

export default CourseCard;
