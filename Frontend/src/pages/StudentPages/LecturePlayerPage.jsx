import { useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "../../utils/toaster";

const LecturePlayerPage = () => {
  const { lessonId } = useParams();
  const {course} = useOutletContext();
  console.log(course)
  const [materials, setMaterials] = useState([]);
  const [resolvedMaterials, setResolvedMaterials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [accessLoading, setAccessLoading] = useState(true);

  const [activeVideo, setActiveVideo] = useState(null);
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [markingComplete, setMarkingComplete] = useState(false);

  /* ================= FETCH MATERIAL METADATA ================= */
  useEffect(() => {
    if (!lessonId) return;

    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/materials/${lessonId}`,
          { withCredentials: true }
        );
        setMaterials(res.data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [lessonId]);

  /* ================= FETCH ACCESS URLS ================= */
  useEffect(() => {
    if (!materials.length) {
      setLoading(false);
      setAccessLoading(false)
      setResolvedMaterials([])
      setActiveMaterial(null)
      setActiveVideo(null)
      return;
    }

    const resolveUrls = async () => {
      setAccessLoading(true);
      try {
        const resolved = await Promise.all(
          materials.map(async (m) => {
            const res = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/materials/access/${m._id}`,
              { withCredentials: true }
            );
            return { ...m, accessUrl: res.data?.data?.url };
          })
        );

        setResolvedMaterials(resolved);

        const firstVideo = resolved.find(
          (m) => m.materialType === "video"
        );
        setActiveVideo(firstVideo || null);
      } catch (err) {
        console.log(err);
      } finally {
        setAccessLoading(false);
      }
    };

    resolveUrls();
  }, [materials]);

  /* ================= DERIVED ================= */
  const videos = resolvedMaterials.filter(
    (m) => m.materialType === "video"
  );
  const resources = resolvedMaterials.filter(
    (m) => m.materialType !== "video"
  );

  /* ================= MARK COMPLETE (Promise.all) ================= */
  const handleMarkComplete = async () => {
    if (!materials.length) return;

    setMarkingComplete(true);
    try {
      await Promise.all(
        materials.map((material) =>
          axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/course-progress/material/${material._id}`,
            {courseId:course._id,isCompleted:true},
            { withCredentials: true }
          )
        )
      );
      Toaster("Marked as Complete.","success")
      console.log("All materials marked as complete");
    } catch (error) {
      console.log("Failed to mark materials complete", error);
    } finally {
      setMarkingComplete(false);
    }
  };

  /* ================= LOADERS ================= */
  if (loading || accessLoading) {
    return (
      <div className="space-y-4">
        <div className="aspect-video rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ================= VIDEO PLAYER ================= */}
      <div className="space-y-4">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
          {activeVideo?.accessUrl ? (
            <iframe
              src={activeVideo.accessUrl}
              className="w-full h-full"
              allowFullScreen
              title={activeVideo.title}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white">
              No video available
            </div>
          )}
        </div>

        {/* ===== Video Selector (if multiple) ===== */}
        {videos.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 max-md:gap-2">
            {videos.map((v, idx) => (
              <button
                key={v._id}
                onClick={() => setActiveVideo(v)}
                className={`flex-shrink-0 rounded-lg border px-4 py-2 text-sm transition
                  ${
                    activeVideo?._id === v._id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:bg-gray-50"
                  }`}
              >
                Video {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ================= DETAILS ================= */}
      <div className="flex items-start justify-between gap-4 max-md:flex-col">
        <div>
          <h2 className="text-lg font-semibold">
            {activeVideo?.title}
          </h2>
          {activeVideo?.description && (
            <p className="text-sm text-gray-600 mt-1">
              {activeVideo.description}
            </p>
          )}
        </div>

        
        <button
          onClick={handleMarkComplete}
          disabled={markingComplete}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm text-white disabled:opacity-60"
        >
          {markingComplete && (
            <span className="h-4 w-4 animate-spin rounded-full border border-white border-t-transparent" />
          )}
          Mark as Complete
        </button>
      </div>

      {/* ================= RESOURCES ================= */}
      {resources.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Lesson Resources
          </h3>

          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            {resources.map((m) => (
              <button
                key={m._id}
                onClick={() => {
                  setActiveMaterial(m);
                  setShowModal(true);
                }}
                className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md text-left"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">{m.title}</p>
                  <span className="text-[10px] uppercase text-gray-500">
                    {m.materialType}
                  </span>
                </div>

                {m.description && (
                  <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                    {m.description}
                  </p>
                )}

                <p className="mt-2 text-[10px] text-gray-400">
                  Added {new Date(m.createdAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && activeMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-xl p-4">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-3 text-gray-500"
            >
              ✕
            </button>

            <h3 className="text-sm font-semibold mb-2">
              {activeMaterial.title}
            </h3>

            <iframe
              src={activeMaterial.accessUrl}
              className="h-[70vh] w-full rounded-md"
              title={activeMaterial.title}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturePlayerPage;
