import { createContext, useContext, useState, useEffect } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL + "/";
const FavoriteTeamsContext = createContext();

export const FavoriteTeamsProvider = ({ children }) => {
    const [favoriteTeams, setFavoriteTeams] = useState([]);
    const [userName, setUserName] = useState("Favorite");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userEmail, setUserEmail] = useState("franny@citygirl.com");

    useEffect(() => {

        fetch(`${BACKEND_URL}me/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include'
        })
        .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch favorite teams");
            return res.json();
        })
        .then((data) => {
            setFavoriteTeams(data.favorite_team_ids || []);
            setUserName(data.username);
            setFirstName(data.first_name)
            setLastName(data.last_name);
            setUserEmail(data.email);
        })
        .catch((err) => console.error("Error fetching favorite teams:", err));
    }, []);

    return (
        <FavoriteTeamsContext.Provider
        value={{ 
            favoriteTeams, 
            setFavoriteTeams, 
            userName,
            firstName,
            lastName,
            userEmail
        }}>
            {children}
        </FavoriteTeamsContext.Provider>
    );
};

export const useFavoriteTeams = () => useContext(FavoriteTeamsContext);
