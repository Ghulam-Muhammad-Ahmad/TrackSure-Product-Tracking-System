import React, { useContext, useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../providers/authProvider";

const PrivateRoute = () => {
  const { token, profile, loading } = useContext(AuthContext);

  const isTokenValid = useMemo(() => {
    if (!token) return false;
    try {
      const { exp } = jwtDecode(token);
      return exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }, [token]);

  if (loading) return <div>Loading...</div>;

  if (!isTokenValid || !profile || !profile.user_id) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default React.memo(PrivateRoute);
