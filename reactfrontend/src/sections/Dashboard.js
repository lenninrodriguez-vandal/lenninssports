import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LiveGames from "./LiveGames";
import FavoriteTeams from "./FavoriteTeams";
import UpcomingGames from "./UpcomingGames";
import Results from "./Results";
import { useFavoriteTeams } from "../context/favoritesContext";
import { useAuth } from "../context/AuthContext";
import PacmanLoader from "react-spinners/PacmanLoader";


const finishedStates = ["FT", "AOT", "CANC", "ABD", "AET", "PEN", "AWD", "WO", "AW", "AP", "Match Canceled", "Match Finished"]

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL + '/'


const Dashboard = () => {
    const { favoriteTeams } = useFavoriteTeams();
    const { checkAuthStatus, isAuthenticated } = useAuth();
    const [favoriteTeamsList, setFavoriteTeamsList] = useState([]); 
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [pastGames, setPastGames] = useState([]);
    const [liveGames, setLiveGames] = useState([]);
    const [LoadingState, setLoadingState] = useState(true);
    const [liveGameLoading, setLiveGameLoading] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState(null);

    const navigate = useNavigate();

    const fetchFavoriteTeams = useCallback(async () => {
        try {
          let allTeamDetails = [];
          for (const team of favoriteTeams) {
            const teamDetails = await fetch(BACKEND_URL + `team_details?team_id=${encodeURIComponent(team)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            const teamData = await teamDetails.json();
            allTeamDetails = [...allTeamDetails, ...teamData?.teams || []];
          }
          setFavoriteTeamsList(allTeamDetails);
        } catch (error) {
          console.error("Error fetching favorite teams:", error);
        }
    }, [favoriteTeams]);
    
    // Fetch games
    const fetchGames = useCallback(async () => {
        try {
            // Define time range
            const now = new Date();
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(now.getDate() - 14);
            const twoWeeksFromNow = new Date();
            twoWeeksFromNow.setDate(now.getDate() + 14);
    
            // Create an array of fetch promises for upcoming and past games
            const upcomingPromises = favoriteTeams.map(team => 
                fetch(`${BACKEND_URL}upcoming_games?team_id=${encodeURIComponent(team)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                }).then(res => res.json())
            );
    
            const pastPromises = favoriteTeams.map(team => 
                fetch(`${BACKEND_URL}past_games?team_id=${encodeURIComponent(team)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                }).then(res => res.json())
            );
    
            // Wait for all API requests to complete in parallel
            const [upcomingResults, pastResults] = await Promise.all([
                Promise.all(upcomingPromises),
                Promise.all(pastPromises)
            ]);
    
            let allUpcomingGames = [];
            let allPastGames = [];
            let allLiveGames = [];
    
            // Process results
            favoriteTeams.forEach((team, index) => {
                const upcomingData = upcomingResults[index]?.events || [];
                const pastData = pastResults[index]?.results || [];
    
                let finishedGames = upcomingData.filter(game => finishedStates.includes(game.strStatus));
    
                // Filter upcoming games (2 games per team, within 2 weeks)
                let filteredUpcomingGames = upcomingData
                    .filter(game => ["NS", "Not Started"].includes(game.strStatus))
                    .filter(game => {
                        const gameDate = new Date(game.strTimestamp);
                        return gameDate >= now && gameDate <= twoWeeksFromNow;
                    })
                    .sort((a, b) => new Date(a.strTimestamp) - new Date(b.strTimestamp))
                    .slice(0, 2);
    
                // Filter past games (2 games per team, within last 2 weeks)
                const filteredPastGames = [...pastData, ...finishedGames]
                    .filter(game => {
                        const gameDate = new Date(game.strTimestamp);
                        return gameDate >= twoWeeksAgo && gameDate < now;
                    })
                    .sort((a, b) => new Date(b.strTimestamp) - new Date(a.strTimestamp))
                    .slice(0, 2);
    
                // Find live games
                let liveGames = upcomingData.filter(game => 
                    game.strStatus && !["NS", "Not Started", ...finishedStates].includes(game.strStatus)
                );
    
                allUpcomingGames.push(...filteredUpcomingGames);
                allPastGames.push(...filteredPastGames);
                allLiveGames.push(...liveGames);
            });
    
            // Fetch live games from V2 if any live games exist
            if (allLiveGames.length > 0 && allLiveGames.length !== 0) {
                const liveV1GameIds = allLiveGames.map(game => game.idEvent);
                const liveGamesV2Res = await fetch(`${BACKEND_URL}live_games`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });
                const liveV2Data = await liveGamesV2Res.json();
                let liveV2Games = liveV2Data?.livescore || [];
    
                allLiveGames = liveV2Games.filter(game => liveV1GameIds.includes(game.idEvent));
            }
    
            // Deduplicate games
            const dedupeGames = (games) => Array.from(new Map(games.map(game => [game.idEvent, game])).values());
    
            setUpcomingGames(dedupeGames(allUpcomingGames));
            setPastGames(dedupeGames(allPastGames));
            setLiveGames(allLiveGames);
        } catch (error) {
            console.error("Error fetching game data:", error);
        }
    }, [favoriteTeams]);

    const fetchAllData = useCallback(async () => {
        setLoadingState(true);
        try {
            await Promise.all([fetchFavoriteTeams(), fetchGames()]);
            setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setTimeout(() => {
                setLoadingState(false);
            }, 300);
            
        }
        // eslint-disable-next-line
    }, [favoriteTeams]);

    const refreshLiveGames = useCallback(async () => {
        try {
            setLiveGameLoading(true);
            await fetchGames();
            setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
            setLiveGameLoading(false);
        } catch (error) {
            console.error("Error refreshing live games:", error);
        }
    }, [fetchGames]);


    // Fetch games with an interval.
    // If it detects a live game it will refresh every 2 mins as
    // that is the update time Sports DB provides for their live
    // games. If no live games, it will make the calls every 5 minutes.
    useEffect(() => {
        checkAuthStatus();

        if (!isAuthenticated) {
            navigate("/login");
        }

        fetchAllData(); 

        const interval = setInterval(refreshLiveGames, liveGames.length > 0 ? 120000 : 300000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [ refreshLiveGames, liveGames.length]);


    return (
        <section>
            {LoadingState ? (
            <div style={{ display: "flex", justifyContent: "center", margin: "25vh 13vw 25vh 0" }}>
                <PacmanLoader color="#3498db" size={60} />
            </div>
            ) : (
            <>
                <LiveGames 
                games={liveGames} 
                refreshLiveGames={refreshLiveGames}
                lastRefreshed={lastRefreshed}
                isRefreshing={liveGameLoading}
                />
                <FavoriteTeams teams={favoriteTeamsList}/>
                <UpcomingGames upcomingGames={upcomingGames}/>
                <Results games={pastGames}/>
            </>
            )}
        </section>
    );
};

export default Dashboard