import React from "react";
import './NavBar.css';
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL + '/'


const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { checkAuthStatus } = useAuth();

    const handleLogoClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleBackClick = () => {
        const savedScrollPosition = sessionStorage.getItem('scrollPosition');
        navigate("/dashboard"); // Navigate back to dashboard home
        setTimeout(() => {
            requestAnimationFrame(() => {
                if (savedScrollPosition) {
                    window.scrollTo(0, parseInt(savedScrollPosition, 10));
                }
            });
        }, 10);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}logout/`, {
                method: "POST",
                credentials: "include", // Ensure cookies are sent with the request
                headers: { "Content-Type": "application/json" },
            });
    
            if (response.ok) {
                await checkAuthStatus(); // Update authentication state
                navigate("/login");
            } else {
                console.error("Logout failed");
            }
        } catch (err) {
            console.error("Error during logout:", err);
        }
    };
      

    // Check if current path is one of the public pages (root, signup, or login)
    const isPublicPath = ["/", "/signup", "/login"].includes(location.pathname);

    return (
        <nav className="navbar">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src="/favicon.ico"
                    alt="Logo"
                    className="logo"
                    onClick={handleLogoClick}
                />
                <p className="nav-bar-text">Lennin's Sports Dashboard</p>
            </div>
            {!isPublicPath && (
                <div className="logout-back-container">
                    <button className="logout-button" style={{marginRight: location.pathname === '/dashboard' ? "25px" : "auto"}} onClick={handleLogout}>Logout</button>
                    {location.pathname !== '/dashboard' && (
                        <button className="back-button" onClick={handleBackClick}>Back</button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default NavBar;
