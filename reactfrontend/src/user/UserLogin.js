import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Used for redirecting after login
import './UserLogin.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL + '/'

const UserLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        // if (token) navigate("/dashboard")
        window.scrollTo(0, 0);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent page refresh
        console.log("username: " + username)


        const response = await fetch(`${BACKEND_URL}token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.access); // Store token
            localStorage.setItem("refreshToken", data.refresh);
            navigate("/dashboard"); // Redirect user after login
        } else {
            setError("Invalid username or password.");
        }
    };

    return (
        <div className="login-page-container">
            <div className="align">
                <div className="text-box-container">
                    <img src="/favicon.ico" alt="Logo" className="login-logo"/>
                    <h3 className="login-title">Please login!</h3>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <input
                        type="text"
                        className="input-box"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        className="input-box"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="login-button" onClick={handleLogin}>Login</button>
                    <p className="login-link">
                        Don't have an account? <a href="/signup">Sign up</a> for free!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;