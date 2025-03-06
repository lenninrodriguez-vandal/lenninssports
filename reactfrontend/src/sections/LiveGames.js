import { React, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import './LiveGames.css';

const LiveGames = ({ games, refreshLiveGames, lastRefreshed }) => {
  // Sort games by date and time
  const sortedGames = [...games].sort(
    (a, b) => new Date(a.strTimestamp) - new Date(b.strTimestamp)
  );

  const [isRefreshing, setIsRefreshing] = useState(false);
  // const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshLiveGames();
    setIsRefreshing(false);
  };  

  const formatInning = (inning) => {
    const suffixes = { 1: "st", 2: "nd", 3: "rd" };
    return `${inning}${suffixes[inning % 10] || "th"} Inning`;
  };
  
  const gameTimeFormat = (sport, gameProgress, gameStatus) => {
    // Common statuses shared across multiple sports
    const commonStatus = {
      FT: "Final",
      AOT: "OT/Final",
    };

    // Check common statuses
    if (commonStatus[gameStatus]) return commonStatus[gameStatus];
  
    const sportSpecificStatus = {
      "American Football": {
        HT: "Halftime",
      },
      "Ice Hockey": {
        BT: "Intermission",
        PT: "Shootout",
        AP: "Shootout/Final",
      },
      "Soccer": {
        HT: "Halftime",
        BT: "ET/Halftime",
        P: "Penalty Shootout",
        PEN: "Penalties/Final",
        AET: "ET/Final",
      },
    };
  
    if (sportSpecificStatus[sport]?.[gameStatus]) {
      return sportSpecificStatus[sport][gameStatus];
    }
  
    if (sport === "American Football") {
      let timeLeft = 15 - parseInt(gameProgress, 10);
      return `${gameStatus} - ${timeLeft.toString().padStart(2, "0")}:00`;
    }
  
    if (sport === "Ice Hockey") {
      let timeLeft = 20 - parseInt(gameProgress, 10);
      return `${gameStatus} - ${timeLeft.toString().padStart(2, "0")}:00`;
    }
  
    if (sport === "Soccer") {
      return `${gameStatus} - ${gameProgress}'`;
    }
  
    if (sport === "Baseball") {
      let inning = parseInt(gameProgress.slice(2), 10);
      return formatInning(inning);
    }
  
    return gameStatus; // Default if sport isn't recognized
  };

  return (
    <section className="live-games-container">
      <h2 className="live-games-title">Live Games</h2>
      {sortedGames.length > 0 ? (
        <div className="live-games-list">
          {sortedGames.map((game) => (
            <div key={game.idEvent} className="live-game-card">
              <div className="teams">
                <span className="team-name">{game.strHomeTeam}</span>
                <span className="score">{game.intHomeScore ? game.intHomeScore : 0}</span>
                <span className="vs">vs</span>
                <span className="score">{game.intAwayScore ? game.intAwayScore : 0}</span>
                <span className="team-name">{game.strAwayTeam}</span>
              </div>
              <p className="game-status">{gameTimeFormat(game.strSport, game.strProgress, game.strStatus)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-live-games">No Live Games at the moment.</p>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <button style={{display: "contents", color: "#A5ACAF", cursor: "pointer"}} onClick={handleRefresh} disabled={isRefreshing}>
          <FaSyncAlt className={isRefreshing ? "spinning" : ""} />
        </button>
      {lastRefreshed && <span style={{color: "#A5ACAF"}}>Last refreshed: {lastRefreshed}</span>}
    </div>
    </section>
  );
};

export default LiveGames;