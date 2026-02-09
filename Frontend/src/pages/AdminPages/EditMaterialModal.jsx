import { useState } from "react";
import { FiX } from "react-icons/fi";

const EditMaterialModal = ({ material, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: material.title,
    description: material.description || "",
    url: material.url, // string for video/link, File for pdf
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    // 🔴 Do not modify payload shape
    await onSave(material._id, form);

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 relative">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          <FiX />
        </button>

        <h3 className="font-semibold">Edit Material</h3>

        {/* TITLE */}
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Title"
        />

        {/* DESCRIPTION */}
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Description"
        />

        {/* URL or FILE (PDF ONLY) */}
        {material.materialType === "pdf" ? (
          <div className="w-full">
            {/* Hidden native input */}
            <input
              type="file"
              id="pdfUploadBtn"
              accept="application/pdf"
              onChange={(e) =>
                setForm({ ...form, url: e.target.files?.[0] || null })
              }
              className="hidden"
            />

            {/* Custom upload button */}
            <label
              htmlFor="pdfUploadBtn"
              className="flex items-center justify-center gap-2
               w-fit cursor-pointer rounded-md
               border border-gray-300 bg-white
               px-4 py-2 text-sm font-medium
               hover:border-blue-500 hover:text-blue-600
               transition"
            >
              Upload PDF
            </label>

            {/* Show selected file */}
            {form.url && (
              <p className="mt-2 text-xs text-gray-600 truncate">
                Selected file:{" "}
                <span className="font-medium">{form.url.name}</span>
              </p>
            )}
          </div>
        ) : (
          <input
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="URL"
          />
        )}

        {/* ACTION */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditMaterialModal;
