import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdMenuBook,
  MdPeople,
  MdAdminPanelSettings,
} from "react-icons/md";

/* ========== SIDEBAR ITEM ========== */
const SidebarItem = ({ to, icon: Icon, label, onItemClick }) => (
  <NavLink to={to} end>
    {({ isActive }) => (
      <div
        onClick={onItemClick}
        className={`
          group
          flex items-center gap-3
          px-[clamp(0.95rem,1.3vw,1.15rem)]
          py-[clamp(0.6rem,1vw,0.75rem)]
          rounded-lg
          text-[clamp(0.9rem,1vw,0.95rem)]
          font-medium
          transition-all duration-200
          cursor-pointer

          ${
            isActive
              ? `
                bg-blue-50
                text-blue-700
                ring-1 ring-blue-100
              `
              : `
                text-gray-700
                hover:bg-gray-100
              `
          }
        `}
      >
        <Icon
          className={`
            text-[1.3rem]
            transition-colors
            ${
              isActive
                ? "text-blue-600"
                : "text-gray-400 group-hover:text-gray-600"
            }
          `}
        />
        <span className="truncate">{label}</span>
      </div>
    )}
  </NavLink>
);

/* ========== ADMIN SIDEBAR ========== */
const AdminSidebar = ({ isOpen, onClose }) => {
  const handleItemClick = () => {
    if (window.innerWidth <= 768) onClose();
  };

  return (
    <>
      {/* ===== MOBILE OVERLAY ===== */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30 hidden max-md:block"
        style={{ display: isOpen ? "block" : "none" }}
      />

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          h-dvh
          w-fit
          max-md:w-[clamp(16rem,22vw,18rem)]
          bg-white
          border-r border-gray-200
          flex flex-col
          px-[clamp(0.8rem,1.4vw,1.2rem)]
          py-[clamp(1rem,2vw,1.4rem)]

          /* Mobile animation */
          max-md:fixed max-md:z-50 max-md:top-0 max-md:left-0
          max-md:transition-transform max-md:duration-300 max-md:ease-out
          ${isOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
        `}
      >
        {/* ===== BRAND / HEADER ===== */}
        <div className="flex items-center gap-3 px-2 pb-4">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <MdAdminPanelSettings className="text-[1.4rem]" />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-800">
              Admin Panel
            </p>
            
          </div>
        </div>

        {/* ===== NAVIGATION ===== */}
        <nav className="mt-5 flex-1 space-y-6">
          {/* OVERVIEW */}
          <div>
            <p
              className="
                mb-2 px-3
                text-[0.68rem]
                font-semibold
                uppercase tracking-widest
                text-gray-400
              "
            >
              Overview
            </p>

            <SidebarItem
              to="/admin"
              icon={MdDashboard}
              label="Dashboard"
              onItemClick={handleItemClick}
            />
          </div>

          {/* MANAGEMENT */}
          <div>
            <p
              className="
                mb-2 px-3
                text-[0.68rem]
                font-semibold
                uppercase tracking-widest
                text-gray-400
              "
            >
              Management
            </p>

            <div className="space-y-1 flex flex-col gap-0.5">
              <SidebarItem
                to="/admin/courses"
                icon={MdMenuBook}
                label="Courses"
                onItemClick={handleItemClick}
              />
              {/* <SidebarItem
                to="/admin/students"
                icon={MdPeople}
                label="Students"
                onItemClick={handleItemClick}
              /> */}
            </div>
          </div>
        </nav>

        {/* ===== FOOTER ===== */}
        <div className="pt-4 border-t border-gray-200/70 px-2">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Admin
          </p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
