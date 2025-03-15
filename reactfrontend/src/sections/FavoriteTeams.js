import { useNavigate } from 'react-router-dom';
import React from 'react';
import './FavoriteTeams.css'
import Button from '@mui/material/Button';
import { useFavoriteTeams } from '../context/favoritesContext';
import { IoIosAdd } from "react-icons/io";
import { 
  MdSportsBaseball, 
  MdSportsBasketball,
  MdSportsFootball,
  MdSportsHockey,
  MdSportsRugby,
  MdSportsSoccer 
} from "react-icons/md";


const FavoriteTeams = ({ teams }) => {
  const { userName } = useFavoriteTeams();

  const sportIcons = {
    Rugby: <MdSportsRugby size={40} style={{marginTop: "7px"}}/>,
    Soccer: <MdSportsSoccer size={40} style={{marginTop: "7px"}}/>,
    "American Football": <MdSportsFootball size={40} style={{marginTop: "7px"}}/>,
    Basketball: <MdSportsBasketball size={40} style={{marginTop: "7px"}}/>,
    Baseball: <MdSportsBaseball size={40} style={{marginTop: "7px"}}/>,
    "Ice Hockey": <MdSportsHockey size={40} style={{marginTop: "7px"}}/>
  }

  console.log(teams)
  const sortedTeams = [...teams].sort(
    (a, b) => a.strTeam.localeCompare(b.strTeam)
  );

  const navigate = useNavigate();
  const handleTeamClick = (teamId, teamDetails) => {
    sessionStorage.setItem('scrollPosition', window.scrollY);
    navigate(`/team/${teamId}`, {state: {teamDetails}});
  };

  const sportIconUrl = (sport) => `https://www.thesportsdb.com/images/icons/${sport.toLowerCase()}.png`;

  const flagUrl = (country) => `https://www.thesportsdb.com/images/icons/flags/shiny/32/${country.replace(" ", "-")}.png`;
    
  // Code I found to determine if a color is too dark
  // If it is, we use white text for that specific card
  const isColorTooDark = (hex, threshold = 50) => {
    if (!hex || typeof hex !== "string") {
      return false; // or return a default value (e.g., false) if no color is provided
    }
  
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
      <div style={{display: 'inline-flex', alignItems: "center"}}>
        <h2 className='section-header'>{userName ? `${userName}'s`: "Favorite"} Teams</h2>
        <Button className="edit-teams-button" variant='contained' size='small' onClick={() => navigate('/add-teams')}>
          <IoIosAdd size={40}/>
        </Button>
      </div>
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
            <img src={team.strBadge + "/preview"} alt={`${team.strTeam} logo`} className="team-logo-favorite" />
            <h3>{team.strTeam}</h3>
            <div style={{display: "flex", justifyContent: "center"}}>
              <div style={{display: "flex", alignItems: "center"}}>
                {sportIcons[team.strSport]}
                <img 
                  src={flagUrl(team.strCountry)}
                  alt={`${team.strCountry} flag`} 
                  className="team-flag"
                />
              </div>
            </div>
            <p className="team-record"><b>{team.strLocation}</b></p>
          </div>
        ))}
      </div>
      )}
    </section>
  );
};

export default FavoriteTeams;
