import { createContext, useContext, useState, useEffect } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL + '/'
const FavoriteTeamsContext = createContext();

export const FavoriteTeamsProvider = ({children}) => {
    const [favoriteTeams, setFavoriteTeams] = useState([]);

    useEffect(() => {
        fetch(`${BACKEND_URL}/me/`)
        .then((res) => res.json())
        .then((data) => setFavoriteTeams(data.favorite_team_ids || []));
    }, [])

    return (
        <FavoriteTeamsContext.Provider value={{ favoriteTeams, setFavoriteTeams}}>
            {children}
        </FavoriteTeamsContext.Provider>
    );
};

export const useFavoriteTeams = () => useContext(FavoriteTeamsContext);