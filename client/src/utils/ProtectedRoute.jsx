import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
