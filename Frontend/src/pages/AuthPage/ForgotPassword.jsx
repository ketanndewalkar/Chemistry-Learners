import React, { useState } from "react";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
} from "react-icons/hi";
import { FiX, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/logo1.png"

const ForgotPassword = () => {
  const navigate = useNavigate();
  return (
    <div className="relative inset-0 bg-[#E9EEF2] flex items-center justify-center p-4 min-h-screen">
      
      {/* Close Button */}
      <button onClick={()=>navigate(-1)} className="absolute top-6 right-6 flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-gray-50 transition-all active:scale-95">
        <FiX />
        <span>Close</span>
      </button>

      {/* Card */}
      <div className="w-full max-w-[440px] bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 p-8 sm:p-10">
        
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-gray-800">
            <img src={logo} className="size-15" />
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              Reset Password
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter your details to securely reset your password.
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          
          <Input
            icon={<HiOutlineMail />}
            type="email"
            placeholder="Email address"
          />

          <Input
            icon={<HiOutlineLockClosed />}
            type="password"
            placeholder="New password"
            isPasswordField
          />

          <Input
            icon={<HiOutlineLockClosed />}
            type="password"
            placeholder="Confirm new password"
            isPasswordField
          />

          <PrimaryButton>
            Update Password
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </PrimaryButton>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          Make sure your password is strong and secure.
        </p>
      </div>
    </div>
  );
};

/* ================= SHARED UI COMPONENTS ================= */

const Input = ({ icon, type, isPasswordField, ...props }) => {
  const [show, setShow] = useState(false);

  const inputType = isPasswordField ? (show ? "text" : "password") : type;

  return (
    <div className="group relative">
      
      {/* Left Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
        {React.cloneElement(icon, { size: 18 })}
      </div>

      <input
        {...props}
        type={inputType}
        className={`w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 ${
          isPasswordField ? "pr-12" : "pr-4"
        } outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 text-sm placeholder:text-gray-400`}
      />

      {/* Eye Toggle */}
      {isPasswordField && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1"
        >
          {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      )}
    </div>
  );
};

const PrimaryButton = ({ children }) => (
  <button className="group w-full flex items-center justify-center bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all active:scale-[0.98]">
    {children}
  </button>
);

export default ForgotPassword;
