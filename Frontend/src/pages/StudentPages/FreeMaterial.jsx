import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "../../utils/toaster";

const FreeMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredType, setFilteredType] = useState("all");

  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(true);

  const [activeMaterial, setActiveMaterial] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ================= FETCH FREE MATERIAL IDS ================= */
  useEffect(() => {
    const fetchFreeMaterials = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/free-materials/`
        );
        
        const list = res.data?.data || [];

        /* ===== Resolve each material object ===== */
        const resolved = await Promise.all(
          list.map((item) =>
            axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/free-materials/${item._id}`
            )
          )
        );

        const finalData = resolved.map((r) => r.data?.data);

        setMaterials(finalData.filter(Boolean));
      } catch (err) {
        Toaster(
          err.response?.data?.message || "Failed to fetch free materials.",
          "error"
        );
        
      } finally {
        setLoading(false);
        setResolving(false);
      }
    };

    fetchFreeMaterials();
  }, []);

  /* ================= FILTER ================= */
  const visibleMaterials =
    filteredType === "all"
      ? materials
      : materials.filter((m) => m.materialType === filteredType);
  if(materials.length==0){
    return <>
        <div className="h-[80vh] w-screen flex items-center justify-center"><p>No Free Materials</p></div>
    </>
  }
  /* ================= LOADERS ================= */
  if (loading || resolving) {
    return (
      <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-xl bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 px-[clamp(0.875rem,2.5vw,2.5rem)] py-[clamp(1rem,3vw,3rem)]">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Free Learning Resources</h1>
          <p className="text-sm text-gray-600 mt-1">
            Access curated free videos & PDFs to enhance your learning
          </p>
        </div>

        {/* ================= FILTER ================= */}
        <div className="flex gap-2">
          {["all", "video", "pdf"].map((type) => (
            <button
              key={type}
              onClick={() => setFilteredType(type)}
              className={`rounded-full border px-4 py-1 text-sm capitalize transition
                ${
                  filteredType === type
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:bg-gray-50"
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ================= MATERIAL GRID ================= */}
      <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
        {visibleMaterials.map((m) => (
          <div
            key={m._id}
            className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-lg"
          >
            {/* ===== Badge ===== */}
            <span className="absolute right-4 top-4 rounded-full bg-green-100 px-3 py-1 text-[10px] uppercase text-green-700">
              Free
            </span>

            {/* ===== Icon ===== */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-lg">
              {m.materialType === "video" ? "▶" : "📄"}
            </div>

            {/* ===== Content ===== */}
            <h3 className="text-base font-semibold mb-1 line-clamp-1">
              {m.title}
            </h3>

            {m.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {m.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="uppercase">{m.materialType}</span>
              <span>
                {new Date(m.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* ===== Preview Button ===== */}
            <button
              onClick={() => {
                setActiveMaterial(m);
                setShowModal(true);
              }}
              className="mt-4 w-full rounded-lg border bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
            >
              Preview
            </button>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && activeMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-4xl rounded-xl bg-white p-4 max-md:h-[90vh]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-500"
            >
              ✕
            </button>

            <h2 className="mb-2 text-sm font-semibold">
              {activeMaterial.title}
            </h2>

            <iframe
              src={activeMaterial.url}
              className="h-[75vh] w-full rounded-lg max-md:h-[70vh]"
              title={activeMaterial.title}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeMaterial;
