import React from "react";
import "./Results.css";

const Results = ({ games }) => {
  // Sort games by date (most recent first)
  const sortedResults = [...games].sort(
    (a, b) => new Date(b.strTimestamp) - new Date(a.strTimestamp)
  );

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section>
      <h2 className="section-header">Results</h2>
      {sortedResults.length === 0 ? (
        <p>No past results.</p>
      ) : (
        <div className="results-grid">
          {sortedResults.map((game) => (
            <div key={game.id} className="results-card">
              <div className="game-info">
                <img
                  src={game.strHomeTeamBadge + "/preview"}
                  alt={game.strHomeTeam}
                  className="team-logo"
                />
                <h3>
                  {game.strHomeTeam} {game.intHomeScore} - {game.intAwayScore} {game.strAwayTeam}
                </h3>
                <img
                  src={game.strAwayTeamBadge + "/preview"}
                  alt={game.strAwayTeam}
                  className="team-logo"
                />
              </div>
              <p>{formatDate(game.strTimestamp)}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Results;
