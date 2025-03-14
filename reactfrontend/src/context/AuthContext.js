import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL + "/";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true); // New state to track loading

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}me/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(true);
        console.log("User is authenticated.");
      } else if (response.status === 401){
        setIsAuthenticated(false);
        console.log("User is NOT authenticated.");
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus(); // Runs once on mount
  }, []);

  if (loading) {
    return <div style={{ background: "#1e3c72", minHeight: "100vh" }}></div>; // Prevent flickering before auth status is determined
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
