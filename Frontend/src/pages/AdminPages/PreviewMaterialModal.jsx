import { useEffect, useState } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import { FiX } from "react-icons/fi";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PreviewMaterialModal = ({ material, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===== FETCH MATERIAL URL ===== */
  useEffect(() => {
    const fetchPreviewUrl = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/materials/access/${material._id}`,
          { withCredentials: true }
        );
        console.log(res)
        setPreviewUrl(res.data.data.url);
      } catch (err) {
        console.error("Failed to fetch preview URL", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewUrl();
  }, [material._id]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-[90%] max-w-4xl p-4 space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <FiX />
        </button>

        <h3 className="font-semibold">{material.title}</h3>

        {/* ===== LOADER ===== */}
        {loading && (
          <div className="flex items-center justify-center h-[450px]">
            <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
          </div>
        )}

        {/* ===== VIDEO ===== */}
        {!loading && material.materialType === "video" && previewUrl && (
          <iframe
            className="w-full h-[450px] rounded-lg"
            src={`${previewUrl}`}
            allowFullScreen
          />
        )}

        {/* ===== PDF ===== */}
        {!loading && material.materialType === "pdf" && previewUrl && (
          <div className="overflow-auto h-full rounded">
            <iframe
            src={previewUrl}
            className="w-full h-[450px] rounded-lg border"
          />
          </div>
        )}

      </div>
    </div>
  );
};

export default PreviewMaterialModal;
