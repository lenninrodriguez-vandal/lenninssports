import React from "react";
import './NavBar.css';

const NavBar = () => {
    const handleLogoClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <nav className="navbar">
            <img
                src="/favicon.ico"
                alt="Logo"
                className="logo"
                onClick={handleLogoClick}
            />
            <p className="nav-bar-text">Lennin's Sports Dashboard</p>
        </nav>
    );
};

export default NavBar;
