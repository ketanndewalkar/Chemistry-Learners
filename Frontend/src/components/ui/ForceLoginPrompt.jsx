import { FiAlertTriangle, FiX } from "react-icons/fi";

const ForceLoginPrompt = ({
  visible,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!visible) return null;

  return (
    <div
      className="
        fixed bottom-6 right-6 z-50
        max-md:bottom-0 max-md:right-0
        max-md:w-full
      "
    >
      <div
        className="
          w-[380px] max-md:w-full
          bg-white shadow-2xl
          border border-gray-200
          rounded-xl max-md:rounded-t-2xl
          p-5
          animate-slideUp
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-3 items-center">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <FiAlertTriangle size={18} />
            </div>
            <h3 className="text-base font-semibold text-gray-800">
              Active Session Detected
            </h3>
          </div>

          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 leading-relaxed">
          Your account is currently logged in on another device.
          Do you want to force logout the other session and continue here?
        </p>

        {/* Actions */}
        <div className="flex gap-3 mt-5 max-md:flex-col">
          <button
            onClick={onCancel}
            disabled={loading}
            className="
              w-full
              border border-gray-300
              text-gray-700
              rounded-lg
              px-4 py-2
              text-sm font-medium
              hover:bg-gray-50
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              w-full
              bg-blue-600
              text-white
              rounded-lg
              px-4 py-2
              text-sm font-medium
              hover:bg-blue-700
              transition
              disabled:opacity-70
            "
          >
            {loading ? "Forcing Login..." : "Force Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForceLoginPrompt;
