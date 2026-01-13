import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const StudentRoute = () => {
  const { user } = useAuth();

  if (user.role !== "student") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default StudentRoute;
