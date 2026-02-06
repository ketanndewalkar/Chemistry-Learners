import React, { useRef, useState, useEffect } from "react";
import { navItems } from "./constants";
import { IoMdLogIn } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";
import gsap from "gsap";
import { Link, NavLink } from "react-router-dom";
import UserProfileMenu from "../../ui/UserProfileMenu";
import { useAuth } from "../../../Context/AuthContext";
import logo from "../../../../public/logo1.png"
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mobileNavRef = useRef(null);
  const { user,roleRoute } = useAuth();

  /* ================= GSAP MOBILE ANIMATION ================= */
  useEffect(() => {
    const nav = mobileNavRef.current;
    if (!nav) return;

    gsap.to(nav, {
      y: isOpen ? 0 : "-100%",
      opacity: isOpen ? 1 : 0,
      duration: isOpen ? 0.45 : 0.35,
      ease: isOpen ? "power3.out" : "power3.in",
      pointerEvents: isOpen ? "auto" : "none",
    });
  }, [isOpen]);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 w-dvw h-[clamp(4.2rem,6vw,6.5rem)] px-[clamp(1rem,4vw,3rem)] flex items-center bg-white/95 backdrop-blur-md border-b border-gray-200/60">
        <div className="w-full flex items-center justify-between">

          {/* LOGO */}
          <Link className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-[clamp(2.2rem,3vw,2.6rem)] mix-blend-multiply" />
            <h1 className="font-signika font-semibold text-[clamp(1rem,1.4vw,1.25rem)] text-gray-800 whitespace-nowrap">
              Chemistry Learners
            </h1>
          </Link>

          {/* DESKTOP NAV */}
          <ul className="hidden md:flex items-center gap-[clamp(1.5rem,3vw,2.5rem)]">
            {navItems.map((ele) => (
              <li key={ele.to}>
                <NavLink
                  to={ele.to}
                  end
                  className={({ isActive }) =>
                    `
                      px-3 py-1.5 rounded-lg
                      text-[clamp(0.88rem,1vw,1rem)]
                      font-medium transition-all
                      ${isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-blue-50/70 hover:text-blue-600"}
                    `
                  }
                >
                  {ele.title}
                </NavLink>
              </li>
            ))}
            {user?<NavLink
                  to={`${roleRoute[user.role]}/free-materials`}
                  end
                  className={({ isActive }) =>
                    `
                      px-3 py-1.5 rounded-lg
                      text-[clamp(0.88rem,1vw,1rem)]
                      font-medium transition-all
                      ${isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-blue-50/70 hover:text-blue-600"}
                    `
                  }
                >
                  Free Materials
                </NavLink>:""}
          </ul>

          {/* RIGHT ACTION */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <UserProfileMenu user={user} />
            ) : (
              <Link to="/auth" className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                <IoMdLogIn />
                Login / Register
              </Link>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-2xl text-gray-800"
            onClick={() => setIsOpen((p) => !p)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* ================= MOBILE NAV ================= */}
      <div
        ref={mobileNavRef}
        className="fixed inset-0 z-40 bg-white px-6 py-8 flex flex-col opacity-0 -translate-y-full pointer-events-none"
      >
        <ul className="flex flex-col gap-6 mt-16">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `${isActive ? "text-blue-600 font-semibold" : "text-gray-700"} text-lg font-medium text-gray-800 hover:text-blue-600 w-full block text-center`}
              >
                {item.title}
              </NavLink>
            </li>
          ))}
          {user?<NavLink
                  to={`${roleRoute[user.role]}/free-materials`}
                  end
                  onClick={() => setIsOpen(false)}
                className={({ isActive }) => `${isActive ? "text-blue-600 font-semibold" : "text-gray-700"} text-lg font-medium text-gray-800 hover:text-blue-600 w-full block text-center`}
                >
                  Free Materials
                </NavLink>:""}
        </ul>

        <div className="mt-auto">
          {user ? (
            <Link to="/learn" onClick={() => setIsOpen(false)} className="w-full max-md:block py-3 max-md:px-3 rounded-xl bg-blue-600 text-white text-center">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/auth" onClick={() => setIsOpen(false)} className="w-full max-md:px-3 py-3 rounded-xl bg-blue-600 text-white flex justify-center gap-2 items-center">
              <IoMdLogIn className="text-[clamp(1.5rem,4vw,1.25rem)]"/>
              <p>Login / Register</p>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
