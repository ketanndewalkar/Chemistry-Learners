import { FiTrash2, FiVideo, FiFileText, FiLink, FiEdit } from "react-icons/fi";

const iconMap = {
  video: FiVideo,
  pdf: FiFileText,
  link: FiLink,
};

const typeStyleMap = {
  video: "bg-blue-100 text-blue-700",
  pdf: "bg-red-100 text-red-700",
  link: "bg-green-100 text-green-700",
};

const MaterialCard = ({ material, onDelete, onPreview, onEdit }) => {
  const Icon = iconMap[material.materialType] || FiLink;
  const typeStyle =
    typeStyleMap[material.materialType] || "bg-gray-100 text-gray-700";

  return (
    <div className="flex items-start justify-between rounded-xl border p-4 bg-white">
      <div
        className="flex gap-3 cursor-pointer"
        onClick={() => onPreview(material)}
      >
        <Icon className="mt-1 text-blue-600" />

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">{material.title}</h4>

            <span
              className={`px-2 py-0.5 text-[10px] font-medium rounded-full uppercase ${typeStyle}`}
            >
              {material.materialType}
            </span>
          </div>

          {material.description && (
            <p className="text-xs text-gray-500">
              {material.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => onEdit(material)}>
          <FiEdit className="text-gray-400 hover:text-blue-500" />
        </button>

        <button onClick={() => onDelete(material._id)}>
          <FiTrash2 className="text-gray-400 hover:text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default MaterialCard;
