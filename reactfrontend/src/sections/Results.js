import { useNavigate } from "react-router-dom";
import React from "react";
import "./Results.css";

const Results = ({ games }) => {
  // Sort games by date (most recent first)
  const navigate = useNavigate();
  
  const handleGameClick = (gameId, event) => {
    // Save current position so that we can hop right to it
    // when we hit the back button in the nav bar
    sessionStorage.setItem('scrollPosition', window.scrollY);
    navigate(`/results/${gameId}`, {state: { event }});
  };
  
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
        <p style={{color: "white"}}>No past results.</p>
      ) : (
        <div className="results-grid">
          {sortedResults.map((game) => (
            <div key={game.idEvent} className="results-card" onClick={() => handleGameClick(game.idEvent, game.strEvent)}>
              <div className="game-info">
                <img
                  src={game.strHomeTeamBadge + "/preview"}
                  alt={game.strHomeTeam}
                  className="team-logo-results"
                />
                <h3>
                  {game.strHomeTeam} {game.intHomeScore} - {game.intAwayScore} {game.strAwayTeam}
                </h3>
                <img
                  src={game.strAwayTeamBadge + "/preview"}
                  alt={game.strAwayTeam}
                  className="team-logo-results"
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
