import { useEffect, useState } from "react";
import axios from "axios";
import AddMaterialModal from "./AddMaterialModal";
import MaterialCard from "./MaterialCard";

import { FiPlus } from "react-icons/fi";
import { useParams } from "react-router-dom";
import PreviewMaterialModal from "./PreviewMaterialModal";
import EditMaterialModal from "./EditMaterialModal";
import BackButton from "../../components/ui/BackButton";
import { Toaster } from "../../utils/toaster";

const CourseMaterialsPage = () => {
  const { lessonId,courseId,chapterId } = useParams();

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const [editMaterial, setEditMaterial] = useState(null);

  /* ===== FETCH MATERIALS ===== */
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/materials/${lessonId}`,
          { withCredentials: true }
        );
        setMaterials(res.data.data || []);
      } catch (err) {
        Toaster(
          err.response?.data?.message || "Failed to fetch materials.",
          "error"
        );
       
       setMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [lessonId]);

  /* ===== DELETE MATERIAL ===== */
  const deleteMaterial = async (materialId) => {
    const snapshot = materials;
    setMaterials((prev) => prev.filter((m) => m._id !== materialId));

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/materials/${materialId}`,
        { withCredentials: true }
      );
    } catch {
      setMaterials(snapshot);
    }
  };

  /* ===== UPDATE MATERIAL ===== */
  const updateMaterial = async (id, payload) => {
    const res = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/materials/${id}`,
      payload,
      { withCredentials: true }
    );

    setMaterials((prev) =>
      prev.map((m) => (m._id === id ? res.data.data : m))
    );
  };

  return (
    <div className="mx-auto px-6 py-3 space-y-8">
      <div className="h-[clamp(1rem,2vw,2rem)] flex items-center">
          <BackButton to={`/admin/courses/${courseId}/edit-content-structure`}/>
        </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Lesson Materials</h1>
          <p className="text-sm text-gray-500">
            Manage videos, PDFs and links
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <FiPlus /> Add Material
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="grid gap-4">
          {materials.map((material) => (
            <MaterialCard
              key={material._id}
              material={material}
              onDelete={deleteMaterial}
              onPreview={setPreviewMaterial}
              onEdit={setEditMaterial}
            />
          ))}

          {!materials.length && (
            <p className="text-sm text-gray-500">
              No materials added yet.
            </p>
          )}
        </div>
      )}

      {showAdd && (
        <AddMaterialModal
          lessonId={lessonId}
          onClose={() => setShowAdd(false)}
          onAdded={(newMaterial) =>
            setMaterials((prev) => [newMaterial, ...prev])
          }
        />
      )}

      {previewMaterial && (
        <PreviewMaterialModal
          material={previewMaterial}
          onClose={() => setPreviewMaterial(null)}
        />
      )}

      {editMaterial && (
        <EditMaterialModal
          material={editMaterial}
          onClose={() => setEditMaterial(null)}
          onSave={updateMaterial}
        />
      )}
    </div>
  );
};

export default CourseMaterialsPage;
