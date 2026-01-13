import React from "react";
import { subjects } from "../../utils/constants";

const MentionedCourses = () => {
  return (
    <>
      <h1 className="mt-[5vw] text-signika text-gray-800 text-[clamp(1rem,2vw,1.25rem)]">
        Courses
      </h1>
      <div
        className="
    grid
    grid-cols-3
    gap-[clamp(1.5rem,2vw,2.5rem)]
    mt-[1vw]
    max-lg:grid-cols-2
    max-md:grid-cols-1
  "
      >
        {subjects.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="
          rounded-2xl
          border
          border-neutral-200
          bg-white

          p-[clamp(1.25rem,1.8vw,1.75rem)]

          flex flex-col
          justify-between
          gap-[clamp(1rem,1.6vw,1.4rem)]

          transition-all
          hover:shadow-md
          hover:-translate-y-1
        "
            >
              {/* Top Content */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <Icon className="text-[clamp(1.2rem,1.6vw,1.4rem)]" />
                  <h3 className="font-semibold text-[clamp(1rem,1.2vw,1.25rem)]">
                    {item.title}
                  </h3>
                </div>

                <p className="text-neutral-600 text-[clamp(0.875rem,1vw,0.95rem)]">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap mt-2">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="
                  px-3 py-1
                  rounded-full
                  bg-blue-50
                  text-blue-700

                  text-[clamp(0.7rem,0.9vw,0.8rem)]
                  font-medium
                "
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4">
                <button
                  className="
              px-[clamp(1rem,1.4vw,1.25rem)]
              py-[clamp(0.4rem,0.7vw,0.55rem)]
              rounded-lg
              border
              border-neutral-300

              text-neutral-800
              text-[clamp(0.85rem,1vw,0.9rem)]
              font-medium

              transition-colors
              hover:bg-neutral-100
            "
                >
                  Preview
                </button>

                <button
                  className="
              px-[clamp(1.2rem,1.6vw,1.5rem)]
              py-[clamp(0.45rem,0.8vw,0.6rem)]
              rounded-lg

              bg-blue-600
              text-white
              text-[clamp(0.85rem,1vw,0.95rem)]
              font-medium

              transition-all
              hover:bg-blue-700
              active:scale-[0.97]
            "
                >
                  Enroll
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MentionedCourses;
