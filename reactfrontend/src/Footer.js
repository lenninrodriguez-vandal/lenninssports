import React from "react";
import './Footer.css'

const Footer = () => {
    return (
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Lennin's Sports Dashboard. All rights reserved.</p>
        <p>
          Data provided by <a href="https://www.thesportsdb.com/" target="_blank" rel="noopener noreferrer">The Sports DB</a>.
        </p>
        <p>Built with React.</p>
      </footer>
    );
  };
  
  export default Footer;
  