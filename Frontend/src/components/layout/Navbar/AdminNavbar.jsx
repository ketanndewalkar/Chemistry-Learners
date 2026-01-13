import React from "react";
import { FiMenu } from "react-icons/fi";
import UserProfileMenu from "../../ui/UserProfileMenu";
import logo from "../../../../public/logo1.png"
const AdminNavbar = ({ onSidebarToggle }) => {
  return (
    <nav
      className="
        sticky top-0 z-30
        w-full
        h-[clamp(4.2rem,6vw,6.5rem)]
        px-[clamp(1rem,4vw,3rem)]
        flex items-center
        bg-white/95 backdrop-blur-md
        border-b border-gray-200/60
      "
    >
      <div className="w-full flex items-center justify-between">
        {/* ===== LEFT SECTION ===== */}
        <div className="flex items-center gap-[clamp(0.6rem,1.2vw,1rem)]">
          {/* Hamburger → MOBILE ONLY */}
          <button
            onClick={onSidebarToggle}
            aria-label="Toggle sidebar"
            className="
              hidden
              max-md:flex
              items-center justify-center
              w-[clamp(2.6rem,3.5vw,3rem)]
              h-[clamp(2.6rem,3.5vw,3rem)]
              rounded-xl
              hover:bg-gray-100/70
              active:scale-[0.95]
              transition-all
              text-[clamp(1.4rem,2vw,1.6rem)]
              text-gray-800
            "
          >
            <FiMenu />
          </button>

          {/* Brand */}
          <div className="flex items-center gap-[clamp(0.4rem,1vw,0.6rem)]">
            <img
              src={logo}
              alt="Admin Logo"
              className="h-[clamp(2.2rem,3vw,2.6rem)] mix-blend-multiply"
            />

            <div className="hidden sm:flex items-center gap-2">
              <span
                className="
                  font-signika font-semibold
                  text-[clamp(1rem,1.4vw,1.2rem)]
                  text-gray-800
                  whitespace-nowrap
                "
              >
                Chemistry Learners
              </span>

              {/* Optional badge for clarity */}
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[0.65rem] font-medium text-blue-700">
                ADMIN
              </span>
            </div>
          </div>
        </div>

        {/* ===== RIGHT SECTION ===== */}
        <div className="flex items-center">
          <UserProfileMenu />
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
