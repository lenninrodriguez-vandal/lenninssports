import React from "react";
import "./UpcomingGames.css";

const UpcomingGames = ({ upcomingGames }) => {
  // Sort games by date and time
  const sortedGames = [...upcomingGames].sort(
    (a, b) => new Date(a.strTimestamp) - new Date(b.strTimestamp)
  );

  const formatDate = (timestamp) => {
    return new Date(timestamp + "Z").toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  const formatTime = (timestamp) => {
    return new Date(timestamp + "Z").toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).replace(" ", "").toLowerCase(); // Removes the space before AM/PM
  };

  return (
    <section>
      <h2 className="section-header">Upcoming Games</h2>
      {sortedGames.length === 0 ? (
        <p style={{color: "white"}}>No upcoming games at the moment.</p>
      ) : (
        <div className="games-grid">
          {sortedGames.map((game) => (
            <div key={game.idEvent} className="game-card">
              <div className="game-info">
                <img
                  src={game.strHomeTeamBadge + "/preview"}
                  alt={game.strHomeTeam}
                  className="team-logo-upcoming"
                />
                <h3>{game.strHomeTeam} vs {game.strAwayTeam}</h3>
                <img
                  src={game.strAwayTeamBadge + "/preview"}
                  alt={game.strAwayTeam}
                  className="team-logo-upcoming"
                />
              </div>
              <p>
                {formatDate(game.strTimestamp)} at {formatTime(game.strTimestamp)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default UpcomingGames;

