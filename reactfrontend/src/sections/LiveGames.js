import React from "react";
import './LiveGames.css';

const LiveGames = ({ games }) => {
  // Sort games by date and time
  const sortedGames = [...games].sort(
    (a, b) => new Date(a.strTimestamp) - new Date(b.strTimestamp)
  );


  const gameTimeFormat = (sport, gameProgress, gameStatus) => {
    if (["Ice Hockey", "Football"].includes(sport)){
      return `${gameStatus} - ` + parseInt(gameProgress) < 10 ? `0${gameProgress}:00` : `${gameProgress}:00`;
    }
    if (sport === "Soccer"){
      if (gameStatus === "HT"){}
      return gameStatus === "HT" ? "Halftime" :`${gameStatus} - ${gameProgress}'`
    }
    if (sport === "Baseball"){
      let inning = gameProgress.slice(2)
      if (inning > 3 && inning < 21) return `${inning}th Inning`;
      switch (inning % 10) {
        case 1:  return `${inning}st Inning`;
        case 2:  return `${inning}nd Inning`;
        case 3:  return `${inning}rd Inning`;
        default: return `${inning}th Inning`;
      }
    }
  };

  return (
    <section className="live-games-container">
      <h2 className="live-games-title">Live Games</h2>
      {sortedGames.length > 0 ? (
        <div className="live-games-list">
          {sortedGames.map((game) => (
            <div key={game.id} className="live-game-card">
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
    </section>
  );
};

export default LiveGames;
  