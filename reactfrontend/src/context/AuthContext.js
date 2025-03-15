import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start as null to prevent flickering
  const [loading, setLoading] = useState(true); // New state to track loading

  const checkAuthStatus = () => {
    setLoading(true);
    try {
        const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
            const [name, value] = cookie.split("=");
            acc[name] = value;
            return acc;
        }, {});

        const expiryTimestamp = cookies["auth_expiry"] ? parseInt(cookies["auth_expiry"], 10) : null;
        const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

        if (expiryTimestamp && expiryTimestamp > currentTime) {
            setIsAuthenticated(true);
            console.log("User is authenticated based on auth_expiry.");
        } else {
            setIsAuthenticated(false);
            console.log("User is NOT authenticated (auth_expiry missing or expired).");
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
