import debounce from "lodash.debounce";
import { useMemo, useState } from "react";
import { FiFileText, FiLink, FiTrash2, FiVideo } from "react-icons/fi";
import axios from "axios";
import { CiLink } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";

const LessonCard = ({
  lesson,
  chapterId,
  lessons,
  onLocalUpdate,
  onDeleteLesson,
  onAddAttachment,
}) => {
  const [saving, setSaving] = useState(false);
  const courseId = useParams().courseId;
  const navigate = useNavigate();
  /* ===== SAVE LESSON TITLE ===== */
  const saveLessonTitle = useMemo(
    () =>
      debounce(async (id, title) => {
        if (!id || id.toString().length !== 24) return;

        try {
          setSaving(true);
          await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/lessons/${id}`,
            { title },
            { withCredentials: true }
          );
        } finally {
          setSaving(false);
        }
      }, 600),
    []
  );

  return (
    <div
      className={`relative rounded-xl border border-gray-200 bg-gray-50/70 p-4 space-y-4 ${
        saving ? "opacity-80 pointer-events-none" : ""
      }`}
    >
      {/* MINI LOADER */}
      {saving && (
        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
        </div>
      )}

      {/* LESSON HEADER */}
      <div className="flex items-center gap-3">
        <input
          value={lesson.title}
          onChange={(e) => {
            onLocalUpdate(chapterId, {
              lessons: lessons.map((l) =>
                l._id === lesson._id
                  ? { ...l, title: e.target.value }
                  : l
              ),
            });

            if (e.target.value.trim()) {
              saveLessonTitle(lesson._id, e.target.value);
            }
          }}
          placeholder="Lesson title"
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700"
        />

        <button onClick={() => onDeleteLesson(lesson._id)}>
          <FiTrash2 className="text-gray-400 hover:text-red-500" />
        </button>
      </div>

      {/* ATTACHMENT ACTIONS */}
      <div className="flex gap-5 text-xs">
        <button
          onClick={() => navigate(`/admin/courses/${courseId}/chapters/${chapterId}/lessons/${lesson._id}/materials`)}
          className="flex items-center gap-1 text-blue-600 hover:underline"
        >
          <CiLink /> Attachments
        </button>

      </div>
    </div>
  );
};

export default LessonCard;
