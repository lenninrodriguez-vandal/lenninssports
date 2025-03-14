import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  console.log("Auth state in PrivateRoute:", isAuthenticated);

  // While authentication status is unknown, show a loading indicator.
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  console.log(isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
