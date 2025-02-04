// import React from "react";
// import './NavBar.css';

// const NavBar = () => {
//     return(
//         <nav className="navbar">
//             <img src="/favicon.ico" alt="Logo" className="logo" />
//             <p className="nav-bar-text">Lennin's Sports Dashboard</p>
//         </nav>
//     );
// };

// export default NavBar;

import React from "react";
import './NavBar.css';

const NavBar = () => {
    const handleLogoClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" }); // This scrolls to the top smoothly
    };

    return (
        <nav className="navbar">
            <img
                src="/favicon.ico"
                alt="Logo"
                className="logo"
                onClick={handleLogoClick} // Attach the click handler to the logo
            />
            <p className="nav-bar-text">Lennin's Sports Dashboard</p>
        </nav>
    );
};

export default NavBar;
