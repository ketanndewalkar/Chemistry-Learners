import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AdminNavbar from "../Navbar/AdminNavbar";
import AdminSidebar from "../../../pages/AdminPages/AdminSidebar";
import { ArrowLeft } from "lucide-react";
// import AdminSidebar from "../../../pages/AdminPages/AdminSidebar";
// import AdminNavbar from "../Navbar/AdminNavbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  /* ===== Scroll to top on route change ===== */
  useEffect(() => {
    if (contentRef.current) {
      try {
        contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        contentRef.current.scrollTop = 0;
      }
    }
  }, [location.key]);

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* ===== SIDEBAR ===== */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ===== MAIN AREA ===== */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ===== NAVBAR ===== */}
        <AdminNavbar
          onSidebarToggle={() => setSidebarOpen((prev) => !prev)}
        />

        {/* ===== PAGE CONTENT ===== */}
        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto p-4 max-md:p-4"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
