import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const AdminRoute = ({children}) => {
  const location = useLocation();
  const { user,roleRoute } = useAuth();
  
  if (user.role !== "admin" && user.role === "student") {

    return <Navigate to="/learn" replace />;
  }
  
  return children;
};

export default AdminRoute;
