import React from "react";
import './NavBar.css';
import { useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/login");
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
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                    <button className="back-button" onClick={handleBackClick}>Back</button>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
