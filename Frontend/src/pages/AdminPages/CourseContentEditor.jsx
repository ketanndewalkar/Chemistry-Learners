import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { FiPlus } from "react-icons/fi";
import { useParams } from "react-router-dom";
import ChapterCard from "./ChapterCard";
import BackButton from "../../components/ui/BackButton";

const CourseContentEditor = () => {
  const [chapters, setChapters] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [chapterLoadingMap, setChapterLoadingMap] = useState({});
  const { courseId } = useParams();

  /* ===== ADD CHAPTER ===== */
  const addChapter = async () => {
    const tempId = Date.now();
    setChapters((prev) => [...prev, { _id: tempId, title: "" }]);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chapters/${courseId}`,
        { title: "New Chapter" },
        { withCredentials: true }
      );

      setChapters((prev) =>
        prev.map((c) => (c._id === tempId ? res.data.data : c))
      );
    } catch {
      setChapters((prev) => prev.filter((c) => c._id !== tempId));
    }
  };

  const deleteChapter = async (chapterId) => {
    const snapshot = chapters;
    setChapters((prev) => prev.filter((c) => c._id !== chapterId));

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chapters/${chapterId}`,
        { withCredentials: true }
      );
    } catch {
      setChapters(snapshot);
    }
  };

  const updateChapterLocal = (id, data) => {
    setChapters((prev) =>
      prev.map((l) => (l._id === id ? { ...l, ...data } : l))
    );
  };

  const saveChapterTitle = useMemo(
    () =>
      debounce(async (id, title) => {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/chapters/${id}`,
          { title },
          { withCredentials: true }
        );
      }, 600),
    []
  );

  /* ===== INITIAL FETCH ===== */
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chapters/${courseId}/all`,
        { withCredentials: true }
      )
      .then((res) => setChapters(res.data.data))
      .finally(() => setInitialLoading(false));
  }, []);

  /* ===== FETCH LESSONS ===== */
  useEffect(() => {
    if (!chapters.length) return;

    const fetchLessons = async () => {
      const loading = {};
      chapters.forEach((c) => (loading[c._id] = true));
      setChapterLoadingMap(loading);

      try {
        const results = await Promise.all(
          chapters.map(async (chapter) => {
            const res = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/lessons/${chapter._id}/all`,
              { withCredentials: true }
            );
            return { chapterId: chapter._id, lessons: res.data.data || [] };
          })
        );

        setChapters((prev) =>
          prev.map((c) => {
            const match = results.find((r) => r.chapterId === c._id);
            return match ? { ...c, lessons: match.lessons } : c;
          })
        );
      } finally {
        setChapterLoadingMap({});
      }
    };

    fetchLessons();
  }, [chapters.length]);

  return (
    <div className="p-[clamp(1rem,2vw,2rem)] space-y-8">
      <div className="h-[clamp(1rem,2vw,2rem)] flex items-center">
          <BackButton to={`/admin/courses/${courseId}/edit`}/>
        </div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Course Content</h1>
        <p className="text-sm text-gray-500">
          Organize chapters, lessons and attachments
        </p>
      </div>

      <button
        onClick={addChapter}
        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
      >
        <FiPlus /> Add Chapter
      </button>

      {initialLoading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        </div>
      )}

      <div className="space-y-6">
        {chapters.map((chapter) => (
          <div key={chapter._id} className="relative">
            {chapterLoadingMap[chapter._id] && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              </div>
            )}

            <ChapterCard
              chapter={chapter}
              onDelete={deleteChapter}
              onLocalUpdate={updateChapterLocal}
              onSaveTitle={saveChapterTitle}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContentEditor;
