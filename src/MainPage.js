import React, { useState, useEffect, useCallback, useMemo } from "react";
import NavBar from "./NavBar";
import LiveGames from "./sections/LiveGames";
import UpcomingGames from "./sections/UpcomingGames";
import Results from "./sections/Results";
import FavoriteTeams from "./sections/FavoriteTeams";
import Footer from "./Footer";
import './MainPage.css';

const MainPage = () => {
  const [favoriteTeams, setFavoriteTeams] = useState([]); 
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [pastGames, setPastGames] = useState([]);
  const [liveGames, setLiveGames] = useState([]);
  const favoriteTeamIds = useMemo(() => [137026, 133612, 140082, 135262, 134949, 134149, 136448], []);
  // Hardcoding my favorite teams for now but looking into giving my self
  // the option to add them later on in the UI.

  // Import Sport DB API Key from .env
  const SPORT_DB_API_KEY = process.env.REACT_APP_SPORT_DB_API_KEY
  const API_BASE_URL = `https://www.thesportsdb.com/api/v1/json/${SPORT_DB_API_KEY}/`;

  // Fetch favorite teams
  const fetchFavoriteTeams = useCallback(async () => {
    try {
      let allTeamDetails = [];
      for (const team of favoriteTeamIds) {
        const teamDetails = await fetch(API_BASE_URL + `lookupteam.php?id=${encodeURIComponent(team)}`);
        const teamData = await teamDetails.json();
        allTeamDetails = [...allTeamDetails, ...teamData?.teams || []];
      }
      setFavoriteTeams(allTeamDetails);
    } catch (error) {
      console.error("Error fetching favorite teams:", error);
    }
  }, [favoriteTeamIds, API_BASE_URL]);

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
        const upcomingRes = await fetch(API_BASE_URL + `eventsnext.php?id=${encodeURIComponent(team)}`);
        const pastRes = await fetch(API_BASE_URL + `eventslast.php?id=${encodeURIComponent(team)}`);

        const upcomingData = await upcomingRes.json();
        const pastData = await pastRes.json();

        let upcomingGames = upcomingData?.events || [];
        let pastGames = pastData?.results || [];
        
        // For some reason some finished games stay in the upcoming call for sometime so
        // I filter those out.
        let finishedGames = upcomingGames.filter(game => game.strStatus === "FT");
        
        // Grab all non started games from the upcoming games call
        // Limit to the next two weeks and only grab 2 games per team
        let filteredUpcomingGames = upcomingGames
          .filter(game => ["NS", "Not Started", "FT"].includes(game.strStatus))
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
        const liveGames = upcomingGames.filter(game => 
          game.strStatus && !["NS", "Not Started", "FT"].includes(game.strStatus)
        );

        allUpcomingGames = [...allUpcomingGames, ...filteredUpcomingGames];
        allPastGames = [...allPastGames, ...filteredPastGames];
        allLiveGames = [...allLiveGames, ...liveGames];
      }
      setUpcomingGames(allUpcomingGames);
      setPastGames(allPastGames);
      setLiveGames(allLiveGames);
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  }, [favoriteTeamIds, API_BASE_URL]);


  // Fetch games with an interval.
  // If it detects a live game it will refresh every 2 mins as
  // that is the update time Sports DB provides for their live
  // games. If no live games, it will make the calls every 5 minutes.
  useEffect(() => {
    fetchFavoriteTeams();
    fetchGames();
    const interval = setInterval(fetchGames, liveGames.length > 0 ? 120000 : 300000);
    return () => clearInterval(interval);
  }, [fetchFavoriteTeams, fetchGames, liveGames.length]);

  return (
    <div style={{ 
        background: 'linear-gradient(to bottom, #1e3c72,rgb(42, 152, 64))', 
        minHeight: '100vh' 
      }}>
      <NavBar/>
      <div className="content-wrapper">
        <LiveGames games={liveGames} />
        <FavoriteTeams teams={favoriteTeams}/>
        <UpcomingGames upcomingGames={upcomingGames} />
        <Results games={pastGames} />
        <Footer />
      </div>
    </div>
  );
};

export default MainPage;