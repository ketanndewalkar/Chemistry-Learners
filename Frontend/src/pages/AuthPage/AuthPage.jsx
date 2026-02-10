import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlinePhone,
} from "react-icons/hi";
import { FiX, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { AuthLoginHandler, AuthSignUpHandler } from "./AuthHandler";
import { useAuth } from "../../Context/AuthContext";
import ForceLoginPrompt from "../../components/ui/ForceLoginPrompt";
import { Toaster } from "../../utils/toaster";

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const { login, roleRoute } = useAuth();

  const [showForceLogin, setShowForceLogin] = useState(false);
  const lastLoginPayloadRef = useRef(null);

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    email: "",
    password: "",
  });
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    // If no user → stay on login page
    if (!storedUser) return;

    // User exists → redirect based on their role
    const user = JSON.parse(storedUser);
    const role = user.role;

    const route = roleRoute[role];
    navigate(route, { replace: true });
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    /* ================= LOGIN ================= */
    if (mode === "login") {
      const payload = {
        email: formState.email,
        password: formState.password,
        forceLogin: false,
      };

      lastLoginPayloadRef.current = payload;

      try {
        await AuthLoginHandler(
          payload,
          setLoading,
          navigate,
          setMode,
          login,
          roleRoute
        );
      } catch (err) {
        
        const status = err?.response?.status;
        const message = err?.response?.data?.errors[0];

        if (
          status === 409 &&
          message === "User already logged in from another device"
        ) {
          setShowForceLogin(true);
          return;
        } else {
          Toaster(
            message || "Login failed. Please check your credentials.",
            "error"
          );
        }
      }
    }

    /* ================= REGISTER ================= */
    if (mode === "register") {
      const payload = {
        name: `${formState.firstName.trim()} ${formState.lastName.trim()}`,
        phoneNo: formState.phoneNo,
        email: formState.email,
        password: formState.password,
      };

      try {
        await AuthSignUpHandler(payload, setLoading, navigate, setMode);
        Toaster("Account created successfully", "success");
      } catch (err) {
        Toaster(
          err?.response?.data?.errors[0] || "Registration failed",
          "error"
        );
      }
    }
  };

  const handleForceLogin = async () => {
    if (!lastLoginPayloadRef.current) return;

    const payload = {
      ...lastLoginPayloadRef.current,
      forceLogin: true,
    };

    setShowForceLogin(false);

    try {
      await AuthLoginHandler(
        payload,
        setLoading,
        navigate,
        setMode,
        login,
        roleRoute
      );
    } catch (err) {
      Toaster(err?.response?.data?.errors[0] || "Force login failed", "error");
    }
  };

  useEffect(() => {
    if (!sliderRef.current) return;

    gsap.to(sliderRef.current, {
      x: mode === "login" ? "0%" : "100%",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [mode]);

  return (
    <div className="relative min-h-screen bg-[#E9EEF2] flex items-center justify-center p-4">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 right-6 flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-gray-50 transition-all active:scale-95"
      >
        <FiX />
        Close
      </button>

      <div className="w-full max-w-[440px] bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 p-8 sm:p-10">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-between">
            <img src="./logo1.png" className="h-10" alt="logo" />

            <div className="relative flex bg-gray-100 rounded-xl p-1 w-36 h-10">
              <div
                ref={sliderRef}
                className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
              />
              <button
                disabled={loading}
                onClick={() => setMode("login")}
                className={`relative z-10 w-1/2 text-xs font-bold uppercase ${
                  mode === "login" ? "text-blue-600" : "text-gray-400"
                }`}
              >
                Login
              </button>
              <button
                disabled={loading}
                onClick={() => setMode("register")}
                className={`relative z-10 w-1/2 text-xs font-bold uppercase ${
                  mode === "register" ? "text-blue-600" : "text-gray-400"
                }`}
              >
                Join
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              {mode === "login" ? "Welcome back" : "Create Account"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {mode === "login"
                ? "Enter your details to access your lab."
                : "Start your journey with enthusiastic learners."}
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  icon={<HiOutlineUser />}
                  placeholder="First name"
                  name="firstName"
                  value={formState.firstName}
                  onChange={handleChange}
                  disabled={loading}
                />
                <Input
                  icon={<HiOutlineUser />}
                  placeholder="Last name"
                  name="lastName"
                  value={formState.lastName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <Input
                icon={<HiOutlinePhone />}
                type="tel"
                placeholder="Phone number"
                name="phoneNo"
                value={formState.phoneNo}
                onChange={handleChange}
                disabled={loading}
              />
            </>
          )}

          <Input
            icon={<HiOutlineMail />}
            type="email"
            placeholder="Email address"
            name="email"
            value={formState.email}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            icon={<HiOutlineLockClosed />}
            placeholder="Password"
            name="password"
            isPasswordField
            value={formState.password}
            onChange={handleChange}
            disabled={loading}
          />
          {mode === "login" && (
  <div className="flex justify-end mt-2">
    <Link
      to="/auth/forget-password"
      className="
        text-blue-600 
        text-xs sm:text-sm md:text-base
        hover:underline
        transition
      "
    >
      Forgot Password?
    </Link>
  </div>
)}


          <PrimaryButton loading={loading}>
            {mode === "login" ? "Sign In" : "Create Account"}
          </PrimaryButton>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          By continuing, you agree to our Terms of Service.
        </p>
      </div>

      <ForceLoginPrompt
        visible={showForceLogin}
        onCancel={() => setShowForceLogin(false)}
        onConfirm={handleForceLogin}
        loading={loading}
      />
    </div>
  );
};

const Input = ({ icon, isPasswordField, type = "text", ...props }) => {
  const [show, setShow] = useState(false);
  const inputType = isPasswordField ? (show ? "text" : "password") : type;

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {React.cloneElement(icon, { size: 18 })}
      </div>

      <input
        {...props}
        type={inputType}
        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-12 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
      />

      {isPasswordField && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          disabled={props.disabled}
        >
          {show ? <FiEyeOff /> : <FiEye />}
        </button>
      )}
    </div>
  );
};

const PrimaryButton = ({ children, loading }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full h-14 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition disabled:opacity-70 active:scale-[0.98]"
  >
    {loading ? (
      <Oval
        height={22}
        width={22}
        color="#ffffff"
        secondaryColor="rgba(255,255,255,0.5)"
        strokeWidth={3}
        visible
      />
    ) : (
      <>
        {children}
        <FiArrowRight />
      </>
    )}
  </button>
);

export default AuthPage;
