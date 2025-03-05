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
    
        navigate("/"); // Go back to dashboard home
    
        setTimeout(() => {
            requestAnimationFrame(() => {
                if (savedScrollPosition) {
                    window.scrollTo(0, parseInt(savedScrollPosition, 10));
                }
            });
        }, 10); // Adjust delay for rendering
    };
    

    return (
        <nav className="navbar">
            <div style={{display: 'flex'}}>
                <img
                    src="/favicon.ico"
                    alt="Logo"
                    className="logo"
                    onClick={handleLogoClick}
                />
                <p className="nav-bar-text">Lennin's Sports Dashboard</p>
            </div>
            {location.pathname !== "/" && (
                <button className="back-button" onClick={handleBackClick}>Back</button>
            )}
        </nav>
    );
};

export default NavBar;
