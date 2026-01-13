import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const ProtectedRoute = ({children}) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
      to="/auth"
      // replace
      // state={{ from: location.pathname }}
      />
    );
  }
  

  return children;
};

export default ProtectedRoute;
