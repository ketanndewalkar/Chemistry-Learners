import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { ArrowLeft } from "lucide-react";


const BackButton = ({to}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user,roleRoute } = useAuth();

  const handleBack = () => {
    console.log(to)
    if (!user) return navigate("/auth", { replace: true });

    navigate(to);
  };

  return (
    <div className="h-[clamp(1rem,2vw,2rem)] flex items-center">
          <button
            onClick={handleBack}
            className="
              flex items-center gap-2
              rounded-lg px-2 py-1
              text-sm font-medium text-gray-600
              hover:bg-gray-100
              transition
            "
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
  );
};

export default BackButton;
