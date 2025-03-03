import React from "react";

const NotFound = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "50px", color: "white" }}>
            <img src="/PokemonFranny.png" alt="Pokemon Franny" style={{ width: "180px", marginBottom: "20px" }} />
            <h1>404 - Page Not Found</h1>
            <p>Oops! The page you're looking for doesn't exist. Franny says to use the Back button!</p>
            {/* <button onClick={() => window.location.href = "/"}>Go Home</button> */}
        </div>
    );

};

export default NotFound;