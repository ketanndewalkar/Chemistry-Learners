import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { MdDashboard, MdLogout, MdHome } from "react-icons/md";
import { useAuth } from "../../Context/AuthContext";

const UserProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const { user, logout, roleRoute } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= DASHBOARD DETECTION ================= */
  const dashboardRoutes = ["/learn", "/admin"];

  const isOnDashboard = dashboardRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= HOME / DASHBOARD TOGGLE ================= */
  const handleToggleNavigate = () => {
    setOpen(false);
    navigate(isOnDashboard ? "/" : roleRoute[user.role]);
  };

  return (
    <div ref={menuRef} className="relative">
      {/* ================= PROFILE BUTTON ================= */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center gap-[clamp(0.4rem,0.8vw,0.6rem)]
          px-[clamp(0.6rem,1vw,0.9rem)]
          py-[clamp(0.45rem,0.8vw,0.6rem)]
          rounded-[clamp(0.6rem,1vw,0.8rem)]
          hover:bg-gray-100/70
          active:scale-[0.97]
          transition-all duration-200
        "
      >
        <FaUserCircle
          className="
            text-[clamp(1.4rem,2vw,1.7rem)]
            text-blue-600
          "
        />

        <span
          className="
            hidden md:block
            font-medium
            text-gray-700
            text-[clamp(0.9rem,1vw,1rem)]
            leading-none
          "
        >
          {user.name}
        </span>
      </button>

      {/* ================= DROPDOWN ================= */}
      <div
        className={`
          absolute right-0
          mt-[clamp(0.5rem,1vw,0.75rem)]
          w-[clamp(12rem,18vw,14rem)]
          rounded-[clamp(0.8rem,1vw,1rem)]
          border border-gray-200/60
          bg-white backdrop-blur-md
          shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)]
          transition-all duration-200 ease-out
          origin-top-right
          ${
            open
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          }
        `}
      >
        {/* Home / Dashboard Toggle */}
        <button
          onClick={handleToggleNavigate}
          className="
            flex w-full items-center
            gap-[clamp(0.4rem,0.8vw,0.6rem)]
            px-[clamp(0.8rem,1.2vw,1rem)]
            py-[clamp(0.6rem,1vw,0.75rem)]
            rounded-t-[inherit]
            hover:bg-gray-100/70
            transition
            text-[clamp(0.85rem,1vw,0.95rem)]
            text-gray-700
          "
        >
          {isOnDashboard ? <MdHome /> : <MdDashboard />}
          {isOnDashboard ? "Go to Home" : "Go to Dashboard"}
        </button>

        {/* Profile */}
        <Link
          to={`${roleRoute[user.role]}/profile`}
          onClick={() => setOpen(false)}
          className="
            flex items-center
            gap-[clamp(0.4rem,0.8vw,0.6rem)]
            px-[clamp(0.8rem,1.2vw,1rem)]
            py-[clamp(0.6rem,1vw,0.75rem)]
            hover:bg-gray-100/70
            transition
            text-[clamp(0.85rem,1vw,0.95rem)]
            text-gray-700
          "
        >
          <FaUserCircle className="text-gray-500" />
          Profile
        </Link>

        {/* Divider */}
        <div className="my-[clamp(0.2rem,0.4vw,0.3rem)] h-px bg-gray-200/60" />

        {/* Logout */}
        <button
          onClick={() => {
            setOpen(false);
            logout(navigate);
          }}
          className="
            flex w-full items-center
            gap-[clamp(0.4rem,0.8vw,0.6rem)]
            px-[clamp(0.8rem,1.2vw,1rem)]
            py-[clamp(0.6rem,1vw,0.75rem)]
            rounded-b-[inherit]
            hover:bg-red-50
            transition
            text-[clamp(0.85rem,1vw,0.95rem)]
            text-red-600
          "
        >
          <MdLogout />
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfileMenu;
