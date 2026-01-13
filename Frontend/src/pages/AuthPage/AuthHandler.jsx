import axios from "axios";
import { Toaster } from "../../utils/toaster";

/* ================= SIGN UP ================= */
export const AuthSignUpHandler = async (
  payload,
  setLoading,
  navigate,
  setMode
) => {
  try {
    setLoading(true);

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signup`,
      payload,
      { withCredentials: true }
    );

    if (res.status === 201) {
      Toaster(res.data.message, "success");
      setMode("login");
    } else {
      Toaster(res.data.message || "Signup warning", "warning");
    }

    return res;
  } catch (error) {
    Toaster(
      error?.response?.data?.message || "Signup failed",
      "error"
    );
    throw error;
  } finally {
    setLoading(false);
  }
};

/* ================= LOGIN ================= */
export const AuthLoginHandler = async (
  payload,
  setLoading,
  navigate,
  setMode, // kept for compatibility
  login,
  roleRoute
) => {
  try {
    setLoading(true);

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signin`,
      payload,
      { withCredentials: true }
    );

    if (res.status === 200) {
      Toaster(res.data.message, "success");

      if (typeof login === "function") {
        login(res.data.data);
      }

      const role =
        res.data?.data?.role || res.data?.data?.Role;

      const redirectPath =
        role &&
        roleRoute &&
        typeof roleRoute === "object" &&
        roleRoute[role]
          ? roleRoute[role]
          : "/";

      navigate(redirectPath);
      return res;
    }

    Toaster(res.data.message || "Login warning", "warning");
    return res;
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.errors[0];

    if (
      status === 409 &&
      message === "User already logged in from another device"
    ) {
      throw error; // 👈 IMPORTANT
    }else{
      console.log("hii")
      Toaster(message || "Login failed", "error");
    }

    
    // throw error;
  } finally {
    setLoading(false);
  }
};
