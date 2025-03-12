import { createContext, useContext, useState, useEffect } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL + "/";
const FavoriteTeamsContext = createContext();

export const FavoriteTeamsProvider = ({ children }) => {
    const [favoriteTeams, setFavoriteTeams] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;

        fetch(`${BACKEND_URL}me/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch favorite teams");
            return res.json();
        })
        .then((data) => setFavoriteTeams(data.favorite_team_ids || []))
        .catch((err) => console.error("Error fetching favorite teams:", err));
    }, [token]);

    return (
        <FavoriteTeamsContext.Provider value={{ favoriteTeams, setFavoriteTeams }}>
            {children}
        </FavoriteTeamsContext.Provider>
    );
};

export const useFavoriteTeams = () => useContext(FavoriteTeamsContext);
