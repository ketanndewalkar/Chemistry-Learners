import { FiTrash2 } from "react-icons/fi";
import { CiLink } from "react-icons/ci";
import LessonCard from "./LessonCard";
import axios from "axios";
import { useState } from "react";
import { Toaster } from "../../utils/toaster";

const ChapterCard = ({ chapter, onDelete, onLocalUpdate, onSaveTitle }) => {
  const [loading, setLoading] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizLink, setQuizLink] = useState(chapter.quizLink || "");
  const [savingQuiz, setSavingQuiz] = useState(false);

  /* ===== SAVE QUIZ LINK ===== */
  const saveQuizLink = async () => {
    try {
      setSavingQuiz(true);
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chapters/${chapter._id}`,
        { quizLink },
        { withCredentials: true }
      );

      onLocalUpdate(chapter._id, { quizLink });
      setShowQuizModal(false);
    } catch (e) {
      Toaster(
        e.response?.data?.message || "Failed to save quiz link.",
        "error"
      );
    } finally {
      setSavingQuiz(false);
    }
  };

  /* ===== ADD LESSON ===== */
  const addLesson = async () => {
    setLoading(true);
    const tempId = Date.now();

    const optimisticLessons = [
      ...(chapter.lessons || []),
      { _id: tempId, title: "", resources: [], isTemp: true },
    ];

    onLocalUpdate(chapter._id, { lessons: optimisticLessons });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/lessons/${chapter._id}`,
        { title: "New Lesson" },
        { withCredentials: true }
      );

      onLocalUpdate(chapter._id, {
        lessons: optimisticLessons.map((l) =>
          l._id === tempId ? res.data.data : l
        ),
      });
    } catch (error) {
      Toaster(
        error.response?.data?.message || "Failed to add lesson.",
        "error"
      );
      onLocalUpdate(chapter._id, {
        lessons: optimisticLessons.filter((l) => l._id !== tempId),
      });
    } finally {
      setLoading(false);
    }
  };
const deleteLesson = async (lessonId) => {
    if (!lessonId) return;

    setLoading(true);

    const previousLessons = chapter.lessons || [];

    const updatedLessons = previousLessons.filter(
      (l) => l._id !== lessonId
    );

    onLocalUpdate(chapter._id, {
      lessons: updatedLessons,
    });

    const isTempLesson = lessonId.toString().length !== 24;
    if (isTempLesson) {
      setLoading(false);
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/lessons/${lessonId}`,
        { withCredentials: true }
      );
    } catch (error) {
      Toaster(
        error.response?.data?.message || "Failed to delete lesson.",
        "error"
      );

      onLocalUpdate(chapter._id, {
        lessons: previousLessons,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <section
        className={`relative rounded-2xl border border-gray-300 bg-white shadow-sm p-6 space-y-5 ${
          loading ? "opacity-80 pointer-events-none" : ""
        }`}
      >
        {/* LOADER */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          </div>
        )}

        {/* CHAPTER HEADER */}
        <div className="flex items-center gap-3">
          <input
            value={chapter.title}
            onChange={(e) => {
              onLocalUpdate(chapter._id, { title: e.target.value });
              if (e.target.value.trim()) {
                onSaveTitle(chapter._id, e.target.value);
              }
            }}
            placeholder="Chapter title"
            className="w-full text-gray-800 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium focus:ring focus:ring-blue-100"
          />

          <button onClick={() => onDelete(chapter._id)}>
            <FiTrash2 className="text-gray-400 hover:text-red-500" />
          </button>
        </div>

        {/* ATTACHMENTS BUTTON */}
        <button
          onClick={() => setShowQuizModal(true)}
          className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
        >
          <CiLink /> Attachments
        </button>

        {/* LESSONS */}
        <div className="space-y-4 pl-4 border-l border-gray-200/60">
          {chapter.lessons?.map((lesson) => (
            <LessonCard
              key={lesson._id}
              lesson={lesson}
              chapterId={chapter._id}
              lessons={chapter.lessons}
              onLocalUpdate={onLocalUpdate}
              onDeleteLesson={deleteLesson}
            />
          ))}

          <button
            onClick={addLesson}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Lesson
          </button>
        </div>
      </section>

      {/* ===== QUIZ LINK MODAL ===== */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-lg">
            <h3 className="font-semibold text-gray-900">
              Chapter Attachments
            </h3>

            {/* IFRAME PREVIEW */}
            {quizLink && (
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  src={quizLink}
                  title="Quiz Preview"
                  className="w-full h-[300px]"
                  allowFullScreen
                />
              </div>
            )}

            {/* INPUT */}
            <input
              value={quizLink}
              onChange={(e) => setQuizLink(e.target.value)}
              placeholder="Paste quiz link (Google Form, external quiz, etc.)"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-100"
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowQuizModal(false)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveQuizLink}
                disabled={savingQuiz}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {savingQuiz ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChapterCard;
