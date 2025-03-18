import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Used for redirecting after login
import './UserLogin.css';
import { useAuth } from "../context/AuthContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL + '/'

const UserLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { checkAuthStatus, isAuthenticated } = useAuth();

    useEffect(() => {
        checkAuthStatus();

        if (isAuthenticated) {
            navigate('/dashboard')
        }
        window.scrollTo(0, 0);
        // eslint-disable-next-line
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent page refresh


        const response = await fetch(`${BACKEND_URL}token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            await checkAuthStatus()
            // setTimeout(() => {
            //     navigate("/dashboard"); // Redirect user after login
            // }, 200); 
            navigate('/dashboard');
        } else {
            setPassword("");
            setError("Invalid username or password.");
        }
    };

    const handleKeydown = ( event ) => {
        if (username === "" || password === "") {
            return;
        }
        if (event.key === 'Enter') {
            handleLogin(event);
        }
        
    };

    return (
        <div className="login-page-container">
            <div className="align">
                <div className="text-box-container">
                    <img src="/favicon.ico" alt="Logo" className="login-logo"/>
                    <h1>Lennin's Sports</h1>
                    <h3 className="login-title">Please login!</h3>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <input
                        type="text"
                        className="input-box"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus={true}
                    />
                    <input
                        type="password"
                        className="input-box"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => handleKeydown(e)}
                    />
                    <button className="login-button" onClick={handleLogin} disabled={username === "" && password === ""}>Login</button>
                    <p className="login-link">
                        Don't have an account? <a href="/signup">Sign up</a> for free!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;