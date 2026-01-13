import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "../utils/toaster";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const roleRoute = {
    admin: "/admin",
    student: "/learn",
  };

  // ✅ Load user from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  /* =======================
     Persist user
  ======================= */
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  /* =======================
     AUTH CHECK ON APP START
  ======================= */
  const checkAuth = async () => {
      try {
        setLoading(true);

        // 1️⃣ Validate access token
        const meRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/profile`,
          { withCredentials: true }
        );
        console.log(meRes)
        if (meRes?.data?.data) {
          setUser(meRes.data.data);
          return;
        }
      } catch (error) {
        console.log(error)
        const status = error?.response?.status;
        const message = error?.response?.data?.errors[0];

        // 2️⃣ Access token expired → refresh
        if (status === 401 && message === "Access token expired") {
          console.log("hello")
          try {
            const refreshRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/refreshtoken`,
              { withCredentials: true }
            );
            console.log(refreshRes)
            if (refreshRes?.data?.data) {
              setUser(refreshRes.data.data);
              return;
            }
          } catch (refreshError) {
            console.log(refreshError);
            // Refresh token invalid / expired
            setUser(null);
            localStorage.removeItem("user");
          }
        } else {
          // 3️⃣ Invalid token → force logout
          setUser(null);
          localStorage.removeItem("user");
        }
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    

    checkAuth();
  }, []);

  /* =======================
     LOGIN
  ======================= */
  const login = (userData) => {
    setUser(userData);
  };

  /* =======================
     LOGOUT
  ======================= */
  const logout = async (navigate) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/logout`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        Toaster(res.data.message, "success");
      }

      setUser(null);
      localStorage.removeItem("user");
      navigate("/auth");
    } catch (error) {
      setUser(null);
      localStorage.removeItem("user");
      navigate("/auth");

      Toaster(
        error?.response?.data?.message || "Logout failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setLoading,
        login,
        logout,
        setUser,
        roleRoute,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
