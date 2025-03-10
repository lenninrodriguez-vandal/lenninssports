import { useState, useEffect, useCallback } from "react";
import LiveGames from "./LiveGames";
import FavoriteTeams from "./FavoriteTeams";
import UpcomingGames from "./UpcomingGames";
import Results from "./Results";
import PacmanLoader from "react-spinners/PacmanLoader";



const favoriteTeamIds = [137026, 133612, 140082, 135262, 134949, 134149, 136448];

const finishedStates = ["FT", "AOT", "CANC", "ABD", "AET", "PEN", "AWD", "WO", "AW", "AP", "Match Canceled", "Match Finished"]

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL + '/'


const Dashboard = () => {
    const [favoriteTeams, setFavoriteTeams] = useState([]); 
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [pastGames, setPastGames] = useState([]);
    const [liveGames, setLiveGames] = useState([]);
    const [LoadingState, setLoadingState] = useState(true);
    const [liveGameLoading, setLiveGameLoading] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState(null);

    const fetchFavoriteTeams = useCallback(async () => {
        try {
          let allTeamDetails = [];
          for (const team of favoriteTeamIds) {
            const teamDetails = await fetch(BACKEND_URL + `team_details?team_id=${encodeURIComponent(team)}`);
            const teamData = await teamDetails.json();
            allTeamDetails = [...allTeamDetails, ...teamData?.teams || []];
          }
          setFavoriteTeams(allTeamDetails);
        } catch (error) {
          console.error("Error fetching favorite teams:", error);
        }
    }, []);
    
      // Fetch games
    const fetchGames = useCallback(async () => {
        try {
            let allUpcomingGames = [];
            let allPastGames = [];
            let allLiveGames = [];

            // Only care about games 2 weeks in the past and 2 weeks into the future.
            const now = new Date();
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(now.getDate() - 14);
            const twoWeeksFromNow = new Date();
            twoWeeksFromNow.setDate(now.getDate() + 14);

            for (const team of favoriteTeamIds) {
            const upcomingRes = await fetch(BACKEND_URL + `upcoming_games?team_id=${encodeURIComponent(team)}`);
            const pastRes = await fetch(BACKEND_URL + `past_games?team_id=${encodeURIComponent(team)}`);

            const upcomingData = await upcomingRes.json();
            const pastData = await pastRes.json();

            let upcomingGames = upcomingData?.events || [];
            let pastGames = pastData?.results || [];
            
            // For some reason some finished games stay in the upcoming call for sometime so
            // I filter those out.
            let finishedGames = upcomingGames.filter(game => finishedStates.includes(game.strStatus));
            
            // Grab all non started games from the upcoming games call
            // Limit to the next two weeks and only grab 2 games per team
            let filteredUpcomingGames = upcomingGames
                .filter(game => ["NS", "Not Started"].includes(game.strStatus))
                .filter(game => {
                const gameDate = new Date(game.strTimestamp);
                return gameDate >= now && gameDate <= twoWeeksFromNow;
                })
                .sort((a, b) => new Date(a.strTimestamp) - new Date(b.strTimestamp))
                .slice(0, 2);
            
            // Grab only 2 past games within the last 2 weeks per team.
            const filteredPastGames = [...pastGames, ...finishedGames]
                .filter(game => {
                const gameDate = new Date(game.strTimestamp);
                return gameDate >= twoWeeksAgo && gameDate < now;
                })
                .sort((a, b) => new Date(b.strTimestamp) - new Date(a.strTimestamp))
                .slice(0, 2);
            
            // Grab all the live games from the upcoming call
            let liveGames = upcomingGames.filter(game => 
                game.strStatus && !["NS", "Not Started", ...finishedStates].includes(game.strStatus)
            );

            allUpcomingGames = [...allUpcomingGames, ...filteredUpcomingGames];
            allPastGames = [...allPastGames, ...filteredPastGames];
            allLiveGames = [...allLiveGames, ...liveGames];
            }
            if (allLiveGames.length !== 0){ // Grab Live Games from V2
            const liveV1GameIds = allLiveGames.map(game => game.idEvent);
            const liveGamesV2 = await fetch(BACKEND_URL + "live_games");
            const liveV2Data = await liveGamesV2.json();
            let liveV2Games = liveV2Data?.livescore || [];
            const filteredLiveGames = liveV2Games.filter(game => liveV1GameIds.includes(game.idEvent))
            allLiveGames = filteredLiveGames;
            }
            setUpcomingGames(allUpcomingGames);
            setPastGames(allPastGames);
            setLiveGames(allLiveGames);
        } catch (error) {
            console.error("Error fetching game data:", error);
        }
    }, []);

    const fetchAllData = useCallback(async () => {
        setLoadingState(true);
        try {
            await Promise.all([fetchFavoriteTeams(), fetchGames()]);
            setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoadingState(false);
        }
    }, [fetchFavoriteTeams, fetchGames]);

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
        fetchAllData(); 

        const interval = setInterval(refreshLiveGames, liveGames.length > 0 ? 120000 : 300000);
        return () => clearInterval(interval);
    }, [fetchAllData, refreshLiveGames, liveGames.length]);



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
                <FavoriteTeams teams={favoriteTeams}/>
                <UpcomingGames upcomingGames={upcomingGames}/>
                <Results games={pastGames}/>
            </>
            )}
        </section>
    );

};

export default Dashboard