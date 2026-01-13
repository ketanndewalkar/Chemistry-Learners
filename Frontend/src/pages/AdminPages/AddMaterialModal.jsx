import { useState } from "react";
import axios from "axios";

const AddMaterialModal = ({ lessonId, onClose, onAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materialType, setMaterialType] = useState("video");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ===== ADD MATERIAL ===== */
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("materialType", materialType);
      formData.append("isPreview", isPreview);
      formData.append("lesson", lessonId);

      if (materialType === "pdf") {
        if (!file) {
          alert("Please select a PDF file");
          setLoading(false);
          return;
        }
        // 👇 must match upload.single("url")
        formData.append("url", file);
      } else {
        if (!url) {
          alert("Please provide a URL");
          setLoading(false);
          return;
        }
        formData.append("url", url);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/materials/${lessonId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onAdded(res.data.data);
      onClose();
    } catch (err) {
      console.error("Failed to add material", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 space-y-4">
        {/* LOADER OVERLAY */}
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <div className="h-6 w-6 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
          </div>
        )}

        <h2 className="text-lg font-semibold">Add Material</h2>

        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={materialType}
          onChange={(e) => {
            setMaterialType(e.target.value);
            setUrl("");
            setFile(null);
          }}
        >
          <option value="video">Video</option>
          <option value="pdf">PDF</option>
        </select>

        {/* VIDEO / LINK URL */}
        {(materialType === "video" || materialType === "quiz") && (
          <input
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Material URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        )}

        {/* PDF FILE INPUT */}
        {materialType === "pdf" && (
          
          <input
            type="file"
            accept="application/pdf"
            className="w-full text-sm"
            onChange={(e) => setFile(e.target.files[0])}
          />
          
          
        )}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPreview}
            onChange={(e) => setIsPreview(e.target.checked)}
          />
          Preview available
        </label>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white"
          >
            {loading ? "Saving..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMaterialModal;

