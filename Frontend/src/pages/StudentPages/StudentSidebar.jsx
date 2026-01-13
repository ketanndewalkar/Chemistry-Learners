import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdMenuBook,
  MdShoppingBag,
  MdPerson,
} from "react-icons/md";

/* ========== SIDEBAR ITEM ========== */
const SidebarItem = ({ to, icon: Icon, label, onItemClick,end=false }) => (
  <NavLink to={to} end={end}>
    {({ isActive }) => (
      <div
        onClick={onItemClick}
        className={`
          flex items-center gap-3
          px-[clamp(0.9rem,1.2vw,1.1rem)]
          py-[clamp(0.6rem,1vw,0.75rem)]
          rounded-xl
          text-[clamp(0.9rem,1vw,1rem)]
          font-medium
          transition-all
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
            text-[1.25rem]
            transition-colors
            ${isActive ? "text-blue-600" : "text-gray-400"}
          `}
        />

        <span>{label}</span>
      </div>
    )}
  </NavLink>
);

/* ========== SIDEBAR ========== */
const StudentSidebar = ({ isOpen, onClose }) => {
  /**
   * Close sidebar ONLY on mobile
   */
  const handleItemClick = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <>
      {/* ===== MOBILE OVERLAY ===== */}
      <div
        onClick={onClose}
        className="
          fixed inset-0 z-40
          bg-black/25
          hidden max-md:block
        "
        style={{ display: isOpen ? "block" : "none" }}
      />

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          /* Desktop */
          static
          h-dvh
          w-fit
          max-md:w-[clamp(16rem,22vw,18rem)]
          bg-white
          border-r border-gray-200
          px-[clamp(0.8rem,1.5vw,1.2rem)]
          py-[clamp(1.2rem,2vw,1.6rem)]
          flex flex-col

          /* Mobile */
          max-md:fixed
          max-md:z-50
          max-md:top-0
          max-md:left-0
          max-md:transition-transform
          max-md:duration-300
          max-md:ease-out
          ${isOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
        `}
      >
        {/* ===== MAIN ===== */}
        <div className="space-y-1">
          <SidebarItem
            to="/learn"
            end={true}
            icon={MdDashboard}
            label="Dashboard"
            onItemClick={handleItemClick}
          />
        </div>

        {/* ===== LEARNING ===== */}
        <div className="mt-6">
          <p
            className="
              mb-2 px-3
              text-[clamp(0.65rem,0.8vw,0.75rem)]
              font-semibold
              uppercase tracking-wide
              text-gray-400
            "
          >
            Learning
          </p>

          <div className="space-y-1 flex flex-col gap-1">
            <SidebarItem
              to="/learn/courses"
              icon={MdMenuBook}
              label="Courses"
              onItemClick={handleItemClick}
            />
            <SidebarItem
              to="/learn/my-purchases"
              icon={MdShoppingBag}
              label="My Purchases"
              onItemClick={handleItemClick}
            />
          </div>
        </div>

        {/* ===== ACCOUNT ===== */}
        <div className="mt-6">
          <p
            className="
              mb-2 px-3
              text-[clamp(0.65rem,0.8vw,0.75rem)]
              font-semibold
              uppercase tracking-wide
              text-gray-400
            "
          >
            Account
          </p>

          <SidebarItem
            to="/learn/profile"
            icon={MdPerson}
            label="Profile"
            onItemClick={handleItemClick}
          />
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;
