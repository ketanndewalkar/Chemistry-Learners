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
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Title"
        />

        {/* DESCRIPTION */}
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Description"
        />

        {/* URL or FILE (PDF ONLY) */}
        {material.materialType === "pdf" ? (
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setForm({ ...form, url: e.target.files?.[0] || null })
            }
            className="w-full border rounded px-3 py-2 text-sm"
          />
        ) : (
          <input
            value={form.url}
            onChange={(e) =>
              setForm({ ...form, url: e.target.value })
            }
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
