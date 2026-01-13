import { Play, CheckCircle, ArrowLeft, ChevronDown } from "lucide-react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { FaQuestion } from "react-icons/fa";

const LectureSidebar = ({
  isOpen,
  onClose,
  course,
  chapters,
  lessonsMap,
  progressMap,
}) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [openChapter, setOpenChapter] = useState(null);

  const totalLessons = Object.values(lessonsMap || {}).flat().length;
  const completedLessons = progressMap?.courseProgress ?? 0;

  const progressPercent =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);

  return (
    <>
      {/* ===== MOBILE OVERLAY ===== */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          bg-white border-r border-neutral-200
          w-72 shrink-0 h-full
          px-4 pb-6 overflow-y-auto z-50

          fixed md:static
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* ===== TOP OFFSET (PRESERVED CLAMPED HEIGHT) ===== */}
        <div className="h-[clamp(4.2rem,6vw,6.5rem)] flex items-center">
          <button
            onClick={() => navigate("/learn")}
            className="
              flex items-center gap-2
              rounded-lg px-2 py-1
              text-xs font-medium text-gray-600
              hover:bg-gray-100
              transition
            "
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>

        {/* ===== COURSE INFO ===== */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 leading-snug">
            {course?.title || "Course"}
          </h2>

          <p className="mt-1 text-[11px] text-gray-500">
            {completedLessons} / {totalLessons} lessons completed
          </p>

          <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ===== CHAPTERS ===== */}
        <div className="space-y-4">
          {chapters.map((chapter) => {
            const isOpen = openChapter === chapter._id;

            return (
              <div
                key={chapter._id}
                className="
                  rounded-xl border border-neutral-200
                  bg-gray-50/40
                  overflow-hidden
                "
              >
                {/* ===== CHAPTER HEADER ===== */}
                <button
                  onClick={() => setOpenChapter(isOpen ? null : chapter._id)}
                  className="
                    w-full flex items-center justify-between
                    px-4 py-3
                    text-xs font-semibold text-gray-800
                    hover:bg-gray-100
                    transition
                  "
                >
                  <span className="truncate">{chapter.title}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* ===== LESSONS ===== */}
                {isOpen && (
                  <div className="bg-white divide-y">
                    {lessonsMap[chapter._id]?.map((lesson) => {
                      const done = progressMap?.[lesson._id];

                      return (
                        <NavLink
                          key={lesson._id}
                          to={`/learn/courses/${courseId}/lecture/${lesson._id}`}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `
                              group flex items-center gap-2
                              px-4 py-2.5 text-xs
                              transition relative
                              ${
                                isActive
                                  ? "bg-blue-50 text-blue-700 font-medium"
                                  : "text-gray-700 hover:bg-gray-50"
                              }
                            `
                          }
                        >
                          {/* ACTIVE INDICATOR */}
                          <span
                            className={`
                              absolute left-0 top-0 h-full w-1
                              ${done ? "bg-green-500" : "bg-blue-600"}
                              ${done || lesson ? "opacity-100" : "opacity-0"}
                            `}
                          />

                          {done ? (
                            <CheckCircle
                              size={12}
                              className="text-green-600 shrink-0"
                            />
                          ) : (
                            <Play
                              size={12}
                              className="text-gray-400 group-hover:text-blue-600 shrink-0"
                            />
                          )}

                          <span className="truncate">{lesson.title}</span>
                        </NavLink>
                      );
                    })}
                    {chapter.quizLink ? (
                      <a
                        href={chapter.quizLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
      group flex items-center gap-2
      px-4 py-2.5 text-xs
      transition relative
      text-gray-700 hover:bg-gray-50
    "
                        onClick={onClose}
                      >
                        {/* ACTIVE INDICATOR (static like inactive NavLink) */}
                        <span
                          className="
        absolute left-0 top-0 h-full w-1
        bg-blue-600 opacity-100
      "
                        />

                        <FaQuestion
                          size={12}
                          className="text-gray-400 group-hover:text-blue-600 shrink-0"
                        />

                        <span className="truncate">Quiz</span>
                      </a>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default LectureSidebar;
