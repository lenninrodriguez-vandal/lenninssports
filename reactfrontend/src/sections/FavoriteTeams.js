import { useNavigate } from 'react-router-dom';
import React from 'react';
import './FavoriteTeams.css'

const FavoriteTeams = ({ teams }) => {
  const sortedTeams = [...teams].sort(
    (a, b) => a.strTeam.localeCompare(b.strTeam)
  );

  const navigate = useNavigate();
  const handleTeamClick = (teamId, teamDetails) => {
    sessionStorage.setItem('scrollPosition', window.scrollY);
    navigate(`/team/${teamId}`, {state: {teamDetails}});
  };

  const countryCodes = {
    "Manchester United": 'gb-eng',
  };
    
  // Code I found to determine if a color is too dark
  // If it is, we use white text for that specific card
  const isColorTooDark = (hex, threshold = 50) => {
    // Ensure the hex starts with #
    if (hex.startsWith("#")) hex = hex.slice(1);

    // Convert 3-digit hex to 6-digit
    if (hex.length === 3) {
        hex = hex.split("").map(c => c + c).join("");
    }

    // Convert hex to RGB
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Calculate luminance (relative brightness)
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    // Return true if too dark, false otherwise
    return luminance < threshold;
  };
    
  return (
    <section>
      <h2 className='section-header'>Favorite Teams</h2>
      {sortedTeams.length === 0 ? (
        <p style={{color: "white"}}>No favorite teams.</p>
      ): (
        <div className="teams-grid">
        {sortedTeams.map((team) => (
          <div 
          key={team.idTeam} 
          className="team-card" 
          style={{backgroundColor: team.strColour1, color: isColorTooDark(team.strColour1) ? "#FFFFFF" : "#000000"}}
          onClick={() => handleTeamClick(team.idTeam, team)}
          >
            <img src={team.strBadge + "/preview"} alt={`${team.strTeam} logo`} className="team-logo" />
            <h3>{team.strTeam}</h3>
            <img 
              src={`https://flagcdn.com/w20/${countryCodes[team?.strTeam] ?? "us"}.png`} 
              srcSet={`https://flagcdn.com/w40/${countryCodes[team?.strTeam] ?? "us"}.png 2x`}
              alt={`${team.strCountry} flag`} 
              className="team-flag"
            />
            <p className="team-record"><b>{team.strLocation}</b></p>
          </div>
        ))}
      </div>
      )}
    </section>
  );
};

export default FavoriteTeams;
