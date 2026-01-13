import { useEffect, useState } from "react";
import axios from "axios";

const AdminFreeMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activeMaterial, setActiveMaterial] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    materialType: "pdf",
    url: "",
    file: null,
  });

  /* ================= FETCH FREE MATERIALS ================= */
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/free-materials/`,
        { withCredentials: true }
      );
      setMaterials(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("materialType", form.materialType);

      if (form.materialType === "video") {
        formData.append("url", form.url);
      }

      if (form.materialType === "pdf") {
        formData.append("file", form.file);
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/free-materials`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setShowUploadModal(false);
      setForm({
        title: "",
        description: "",
        materialType: "pdf",
        url: "",
        file: null,
      });

      fetchMaterials();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/free-materials/${id}`,
        { withCredentials: true }
      );
      fetchMaterials();
    } catch (err) {
      console.log(err);
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-44 rounded-xl bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-8 px-[clamp(1rem,3vw,3rem)] py-[clamp(1.25rem,4vw,3.5rem)]">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start max-md:flex-col max-md:gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Free Materials</h1>
          <p className="text-sm text-gray-600">
            Admin panel for managing free learning resources
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700"
        >
          + Add Free Material
        </button>
      </div>

      {/* ================= MATERIAL GRID ================= */}
      {materials.length!=0?<div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
        {materials.map((m) => (
          <div
            key={m._id}
            onClick={() => {
              setActiveMaterial(m);
              setShowPreviewModal(true);
            }}
            className="group relative flex cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-xl"
          >
            {/* ===== TOP BAR ===== */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-lg">
                  {m.materialType === "video" ? "🎥" : "📑"}
                </span>
                <span className="capitalize">{m.materialType}</span>
              </div>

              <button
                onClick={(e) => handleDelete(m._id, e)}
                className="rounded-full p-1.5 text-red-600 hover:bg-red-50"
                title="Delete material"
              >
                {deletingId === m._id ? "…" : "🗑️"}
              </button>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="flex-1 px-4 py-4">
              <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-800">
                {m.title}
              </h3>

              {m.description && (
                <p className="text-xs text-gray-600 line-clamp-3">
                  {m.description}
                </p>
              )}
            </div>

            {/* ===== FOOTER ===== */}
            <div className="flex items-center justify-between px-4 py-3 text-[11px] text-gray-500">
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">
                FREE
              </span>
              <span>
                {new Date(m.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>:<><div className="h-[70vh] w-screen flex items-center justify-center">
      <p>No Material Available</p></div></>
  }

      {/* ================= PREVIEW MODAL ================= */}
      {showPreviewModal && activeMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-4xl rounded-xl bg-white p-[clamp(1rem,3vw,2rem)]">
            <button
              onClick={() => {
                setShowPreviewModal(false);
                setActiveMaterial(null);
              }}
              className="absolute right-4 top-4 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-2">
              {activeMaterial.title}
            </h2>

            {activeMaterial.description && (
              <p className="text-sm text-gray-600 mb-4">
                {activeMaterial.description}
              </p>
            )}

            <iframe
              src={activeMaterial.url}
              title={activeMaterial.title}
              className="h-[75vh] w-full rounded-lg max-md:h-[65vh]"
            />
          </div>
        </div>
      )}

      {/* ================= UPLOAD MODAL ================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-[clamp(1rem,3vw,2rem)]">
            <h2 className="text-lg font-semibold mb-4">
              Upload Free Material
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />

              <select
                name="materialType"
                value={form.materialType}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 text-sm"
              >
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
              </select>

              {form.materialType === "video" && (
                <input
                  type="url"
                  name="url"
                  required
                  value={form.url}
                  onChange={handleChange}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              )}

              {form.materialType === "pdf" && (
                <input
                  type="file"
                  name="file"
                  accept="application/pdf"
                  required
                  onChange={handleChange}
                  className="w-full text-sm"
                />
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-60"
                >
                  {submitting ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFreeMaterial;
