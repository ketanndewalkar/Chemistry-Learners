import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
} from "react-icons/fa";
import logo from "../../../../public/logo1.png"
import { useAuth } from "../../../Context/AuthContext";

const Footer = () => {
  const {user,roleRoute}  = useAuth();
  return (
    <footer className="w-full bg-white border-t border-neutral-200">
      {/* ===== Main Footer ===== */}
      <div
        className="
          max-w-[1200px]
          mx-auto

          px-[clamp(1rem,4vw,3rem)]
          py-[clamp(2.5rem,5vw,3.5rem)]

          grid
          grid-cols-3
          gap-[clamp(2rem,4vw,3rem)]

          max-md:grid-cols-2
          max-sm:grid-cols-1
        "
      >
        {/* ===== Brand ===== */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="size-9" />

            <span className="font-semibold text-neutral-900 text-[clamp(1rem,1.2vw,1.1rem)]">
              Chemistry Learners
            </span>
          </div>

          <p className="text-neutral-600 text-[clamp(0.875rem,1vw,0.95rem)] leading-relaxed max-w-xs">
            Learn chemistry with clarity and confidence through structured
            lessons and expert guidance.
          </p>
        </div>

        {/* ===== Menu ===== */}
        <div className="flex flex-col gap-3 items-center">
          <h4 className="font-semibold text-neutral-900 text-[clamp(0.95rem,1.1vw,1rem)]">
            Menu
          </h4>

          <ul className="flex flex-col gap-2 items-center">
            <FooterNavLink to="/">Home</FooterNavLink>
            <FooterNavLink to="/about">About</FooterNavLink>
            {user?<FooterNavLink to={`${roleRoute[user.role]}/free-materials`}>Free Material</FooterNavLink>:""}
          </ul>
        </div>

        {/* ===== Follow ===== */}
        <div className="flex flex-col gap-3 max-md:col-span-2 max-sm:col-span-1 items-center">
          <h4 className="font-semibold text-neutral-900 text-[clamp(0.95rem,1.1vw,1rem)]">
            Follow
          </h4>

          <div className="flex gap-4">
            <SocialIcon icon={<FaLinkedinIn />} />
            <SocialIcon icon={<FaInstagram />} />
            <SocialIcon icon={<FaFacebookF />} />
          </div>
        </div>
      </div>

      {/* ===== Bottom Bar ===== */}
      <div className="border-t border-neutral-200">
        <div
          className="
            max-w-[1200px]
            mx-auto
            px-[clamp(1rem,4vw,3rem)]
            py-4

            flex
            items-center
            justify-between

            text-neutral-500
            text-[clamp(0.8rem,0.9vw,0.85rem)]

            max-sm:flex-col
            max-sm:gap-2
          "
        >
          <span>© {new Date().getFullYear()} Chemistry Learners</span>
          <span>All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

/* ================= Sub Components ================= */

const FooterNavLink = ({ to, children }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        text-[clamp(0.875rem,1vw,0.95rem)]
        transition-colors
        ${
          isActive
            ? "text-blue-600 font-medium"
            : "text-neutral-600 hover:text-blue-600"
        }
      `
      }
    >
      {children}
    </NavLink>
  </li>
);

const SocialIcon = ({ icon }) => (
  <a
    href="#"
    className="
      flex items-center justify-center
      size-9

      rounded-full
      border
      border-neutral-200

      text-neutral-600
      hover:text-blue-600
      hover:border-blue-600

      transition-colors
    "
  >
    {icon}
  </a>
);
