import { Oval } from "react-loader-spinner";

const GlobalLoader = () => {
  return (
    <div
      className="
        fixed inset-0
        w-dvw h-dvh
        flex items-center justify-center
        bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200
        z-[9999]
      "
    >
      <div
        className="
          flex flex-col items-center justify-center

          /* Desktop-first spacing */
          gap-6
          px-10

          /* Mobile adjustments */
          max-md:gap-4
          max-md:px-6
        "
      >
        {/* Spinner */}
        <div
          className="
            scale-100          /* Desktop */
            max-md:scale-75    /* Mobile */
            transition-transform
          "
        >
          <Oval
            height={64}
            width={64}
            color="#2563eb"          // blue-600
            secondaryColor="#93c5fd" // blue-300
            strokeWidth={4}
            visible
          />
        </div>

        {/* Text */}
        <p
          className="
            text-blue-700
            font-semibold
            tracking-wide

            /* Desktop-first text size */
            text-base

            /* Mobile */
            max-md:text-sm
          "
        >
          Loading...
        </p>
      </div>
    </div>
  );
};

export default GlobalLoader;
