

import { Outlet } from "react-router-dom";
import StudentSidebar from "../../../pages/StudentPages/StudentSidebar";
import StudentNavbar from "../Navbar/StudentNavbar";
import { useEffect, useRef, useState } from "react";
import {useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BackButton from "../../ui/BackButton";

const LearnLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const Up = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Scroll the main ref to top whenever the route changes
    if (Up.current) {
      // use scrollTo for smooth behavior; fallback to setting scrollTop if needed
      try {
        Up.current.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        Up.current.scrollTop = 0;
      }
    }
  }, [location.key]);

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* SIDEBAR */}
      <StudentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* MAIN */}
      <div className="flex flex-1 flex-col">
        <StudentNavbar
          onSidebarToggle={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 overflow-y-auto p-6" ref={Up}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LearnLayout;
