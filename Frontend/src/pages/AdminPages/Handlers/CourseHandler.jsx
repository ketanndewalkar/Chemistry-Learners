import axios from "axios";
import debounce from "lodash.debounce";
import React from "react";
import { useMemo } from "react";

export const fetchCourseDetails = async (
  chapters,
  setchapters,
  setloading,
  courseId
) => {
  try {
    setloading(true);

    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/chapters/${courseId}/all`,
      {
        withCredentials: true,
      }
    );

    const fetchedChapters = res.data.data;

    const chaptersWithLessons = await fetchAllLessonsDetails(fetchedChapters);

    setchapters(chaptersWithLessons);
  } catch (error) {
    console.log(error);
  } finally {
    setloading(false);
  }
};

const fetchAllLessonsDetails = async (chapters) => {
  try {
    const results = await Promise.all(
      chapters.map(async (chapter) => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/lessons/${
              chapter._id
            }/all`,
            {
              withCredentials: true,
            }
          );

          return {
            ...chapter,
            lessons: res.data.data,
          };
        } catch (error) {
          console.log(error);

          return {
            ...chapter,
            lessons: chapter.lessons || [],
          };
        }
      })
    );

    return results;
  } catch (error) {
    console.log(error);
    return chapters;
  }
};

export const addChapter = async (setchapters,courseId) => {
  const tempid = Date.now();
  console.log("hello")
  setchapters((prev) => [...prev, { _id: tempid, title: "" }]);
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chapters/${courseId}`, { title: "New Chapter" }, { withCredentials: true });
    setchapters((prev) =>
      prev.map((c) => (c._id === tempid ? { ...(res.data.data) } : c))
    );
  } catch (error) {
    setchapters((prev) => prev.filter((c) => c._id !== tempid));
  }
};

export const deleteChapter = async (chapterId,chapters,setchapters) => {
    const snapshot = chapters;
    setchapters(prev => prev.filter(c => c._id !== chapterId));
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chapters/${chapterId}`,
        { withCredentials: true }
      );
    } catch {
      setchapters(snapshot);
    }
}

// const saveChapterTitle = useMemo(
    () =>
      debounce(async (id, title) => {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/chapters/${id}`,
          { title },
          { withCredentials: true }
        );
      }, 600),
    []
//   );

export const updateChapterLocal = (id, data,chapters,setchapters) => {
    setchapters(prev=>prev.map(ele=>ele._id===id?{...ele,...data}:ele))
}