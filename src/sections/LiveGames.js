import React from "react";
import './LiveGames.css';

const LiveGames = ({ games }) => {
  // Sort games by date and time
  const sortedGames = [...games].sort(
    (a, b) => new Date(a.strTimestamp) - new Date(b.strTimestamp)
  );

  return (
    <section className="live-games-container">
      <h2 className="live-games-title">Live Games</h2>
      {sortedGames.length > 0 ? (
        <div className="live-games-list">
          {sortedGames.map((game) => (
            <div key={game.id} className="live-game-card">
              <div className="teams">
                <span className="team-name">{game.strHomeTeam}</span>
                <span className="score">{game.intHomeScore}</span>
                <span className="vs">vs</span>
                <span className="score">{game.intAwayScore}</span>
                <span className="team-name">{game.strAwayTeam}</span>
              </div>
              <p className="game-status">{game.strStatus}</p>
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
  