import React, { createContext, useContext, useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack'
import Typography from "@mui/material/Typography";

const AuthContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL + '/'


export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiring, setSessionExpiring] = useState(false);
  const [logoutTimeout, setLogoutTimeout] = useState(null);

  const expiring_modal_style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "auto",
    bgcolor: 'rgb(40, 80, 150)',
    border: '2px solid rgb(0, 200, 80)',
    boxShadow: 24,
    p: 4,
  };

  const checkAuthStatus = () => {
    setLoading(true);
    try {
      const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [name, value] = cookie.split("=");
        acc[name] = value;
        return acc;
      }, {});

      const expiryTimestamp = cookies["auth_expiry"] ? parseInt(cookies["auth_expiry"], 10) : null;
      const currentTime = Math.floor(Date.now() / 1000);

      if (expiryTimestamp && expiryTimestamp > currentTime) {
        setIsAuthenticated(true);
        console.log("User is authenticated.");
        
        if (logoutTimeout) clearTimeout(logoutTimeout);

        const warningTime = 840; // 2 minutes

        // Check if session expires in the next 5 minutes
        const timeUntilExpiry = expiryTimestamp - currentTime;
        if (timeUntilExpiry <= warningTime) { // 300 seconds = 5 minutes
          setSessionExpiring(true);
          setLogoutTimeout(setTimeout(handleLogout, timeUntilExpiry * 1000));
        }

        // Set timeout to trigger session expiration modal
        setTimeout(() => {
          setSessionExpiring(true);
        }, Math.max(timeUntilExpiry - warningTime, 0) * 1000);
      } else {
        setIsAuthenticated(false);
        setSessionExpiring(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
      setSessionExpiring(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOnClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
  }

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleRefresh = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}token/refresh/`, {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });

      if (response.ok) {
        checkAuthStatus();
        setSessionExpiring(false);
        if (logoutTimeout) clearTimeout(logoutTimeout);
      }else if (response.status === 401) {
        checkAuthStatus();
      }
    } catch (err) {
      console.error("Failed to refresh!")
    }
  };

  const handleLogout = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}logout/`, {
            method: "POST",
            credentials: "include", // Ensure cookies are sent with the request
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            checkAuthStatus(); // Update authentication state
            setIsAuthenticated(false);
            setSessionExpiring(false);
            if (logoutTimeout) clearTimeout(logoutTimeout);
            // window.location.href = "/login";
        } else {
            console.error("Logout failed");
        }
    } catch (err) {
        console.error("Error during logout:", err);
    }
  };

  if (loading) {
    return <div style={{ background: "#1e3c72", minHeight: "100vh" }}></div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, checkAuthStatus }}>
      {children}

      {/* Session Expiry Modal */}
      <Modal
          open={sessionExpiring}
          onClose={handleOnClose}
      >
          <Box sx={expiring_modal_style}>
              <Typography variant="h6" textAlign="center">Session Expiring Soon</Typography>
              <Typography sx={{ mt: 2 }}>Your session is about to expire. Please log out or refresh your session.</Typography>
              <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
              marginTop="10px"
              >
                  <Button 
                      variant="contained"
                      sx={{backgroundColor: "green"}}
                      onClick={handleRefresh}
                  >Stay Logged In</Button>
                  <Button 
                      variant="contained" 
                      sx={{background: "#D32F2F", color: "white",borderColor: "#D32F2F","&:hover": {
                          borderColor: "#B71C1C", // Darker red on hover
                          backgroundColor: "rgba(211, 47, 47, 0.87)", // Light red background on hover
                      }}}
                      onClick={handleLogout}
                  >Log Out</Button>
              </Stack>
          </Box>
      </Modal>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
