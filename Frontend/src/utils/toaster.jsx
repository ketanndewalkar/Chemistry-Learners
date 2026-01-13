import toast from "react-hot-toast";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";

export const Toaster = (message, status = "info") => {
  const variants = {
    success: {
      icon: <CheckCircle2 size={20} className="text-green-600" />,
      bg: "bg-green-50/90",
      text: "text-green-700",
      border: "border-green-200",
    },
    error: {
      icon: <XCircle size={20} className="text-red-600" />,
      bg: "bg-red-50/90",
      text: "text-red-700",
      border: "border-red-200",
    },
    warning: {
      icon: <AlertTriangle size={20} className="text-amber-600" />,
      bg: "bg-amber-50/90",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    info: {
      icon: <Info size={20} className="text-blue-600" />,
      bg: "bg-blue-50/90",
      text: "text-blue-700",
      border: "border-blue-200",
    },
  };

  const current = variants[status] || variants.info;

  toast.custom(
    (t) => (
      <div
        role="alert"
        aria-live="assertive"
        className={`
          /* ========= DESKTOP (DEFAULT) ========= */
          pointer-events-auto
          w-[420px]
          max-w-full
          rounded-xl
          border
          px-5 py-4
          shadow-md
          backdrop-blur-md

          flex items-center gap-3

          text-[15px]
          font-medium
          leading-relaxed

          ${current.bg}
          ${current.text}
          ${current.border}

          /* ========= MOBILE (OVERRIDE) ========= */
          max-sm:w-[92vw]
          max-sm:px-4
          max-sm:py-3
          max-sm:text-sm
        `}
      >
        <div className="flex-shrink-0">
          {current.icon}
        </div>

        <p>{message}</p>
      </div>
    ),
    {
      duration: 3500,
      position: "bottom-right",
    }
  );
};
