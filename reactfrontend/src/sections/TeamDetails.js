import { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./TeamDetails.css";

const TeamDetails = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const teamDetails = location.state?.teamDetails
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL + '/'

    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showAllPlayers, setShowAllPlayers] = useState(false);
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [teamCoach, setTeamCoach] = useState({});

    const fetchPlayers = useCallback(async () => {
        try {
            const players = await fetch(`${BACKEND_URL}players_by_team?team_id=${encodeURIComponent(teamId)}`);
            const playersData = await players.json();
    
            if (playersData?.player) {
                // Filter out the coach
                const coach = playersData.player.find(player => player.strPosition === "Manager");
                const filteredPlayers = playersData.player.filter(player => player.strPosition !== "Manager");
    
                setTeamPlayers(filteredPlayers);
                setTeamCoach(coach || null);
            } else {
                setTeamPlayers([]);
                setTeamCoach({});
            }
        } catch (error) {
            console.error("Error fetching team players:", error);
        }
    }, [BACKEND_URL, teamId]);
    

    useEffect(() => {
        if (!teamDetails) {
            navigate("/not-found");
        }
        fetchPlayers();
        window.scrollTo(0, 0);

    }, [teamDetails, navigate, fetchPlayers]);

    if (!teamDetails) return null;

    return (
        <div className="team-details-container">
            <h2 className="team-name-details">{teamDetails.strTeam}</h2>
            <div className="team-logo-detail">
                <img src={teamDetails.strLogo} alt={teamDetails.strTeam} />
            </div>
            <div className="team-info">
                <p><strong>Stadium:</strong> {teamDetails.strStadium}</p>
                <p><strong>Location:</strong> {teamDetails.strLocation}</p>
                <p><strong>Year Formed:</strong> {teamDetails.intFormedYear}</p>
                <p><strong>Sport:</strong> {teamDetails.strSport}</p>
                <p><strong>League:</strong> {teamDetails.strLeague}</p>
            </div>
            <div className="team-colors">
                <p><strong>Team Colors:</strong></p>
                <div className="color-box" style={{ backgroundColor: teamDetails.strColour1 }}></div>
                <div className="color-box" style={{ backgroundColor: teamDetails.strColour2 }}></div>
                {teamDetails.strColour3 && (
                    <div className="color-box" style={{ backgroundColor: teamDetails.strColour3 }}></div>
                )}
            </div>
            <div className="team-description">
                <h3>Description</h3>
                {teamDetails.strDescriptionEN ? (
                    <div>
                        {(showFullDescription || teamDetails.strDescriptionEN.length <= 200
                            ? teamDetails.strDescriptionEN
                            : `${teamDetails.strDescriptionEN.slice(0, 200)}...`
                        ).split(/\r\n\r\n/).map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                
                        {teamDetails.strDescriptionEN.length > 200 && (
                            <button className="see-more-button" onClick={() => setShowFullDescription(!showFullDescription)}>
                                {showFullDescription ? "See Less" : "See More"}
                            </button>
                        )}
                    </div>
                ) : (
                    <p>No description available.</p>
                )}
            </div>
            <div>
                <h3>Coach</h3>
                {teamCoach && teamCoach.idPlayer ? (
                    <div key={teamCoach.idPlayer} className="player-card">
                        <img src={teamCoach.strCutout ? teamCoach.strCutout : '/CoachFranny.png'} alt={teamCoach.strPlayer} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                        <p>{teamCoach.strPlayer ? teamCoach.strPlayer : "Coach Franny"}</p>
                    </div>
                ):(
                    <p>No coach available.</p>
                )}
                <h3>Players</h3>
                {teamPlayers && teamPlayers.length > 0 ? (
                    <div className="player-container">
                        {teamPlayers.slice(0, showAllPlayers ? showAllPlayers.length : 10).map((player) => (
                            <div key={player.idPlayer} className="player-card">
                                <img src={player.strCutout ? player.strCutout : '/PlayerFranny.png'} alt={player.strPlayer} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                                <p>{player.strPlayer}</p>
                            </div>
                        ))}
                    </div>
                ):(
                    <p>No players available.</p>
                )}
                {teamPlayers.length > 10 && (
                    <button className="see-more-button" onClick={() => setShowAllPlayers(!showAllPlayers)}>
                        {showAllPlayers ? "See Less" : "See More"}
                    </button>
                )}
            </div>
            <div className="team-socials">
                <p><a href={teamDetails.strWebsite?.startsWith('http') ? teamDetails.strWebsite : `https://${teamDetails.strWebsite}`} target="_blank" rel="noopener noreferrer">Official Website</a></p>
                <p><a href={teamDetails.strFacebook?.startsWith('http') ? teamDetails.strFacebook : `https://${teamDetails.strFacebook}`} target="_blank" rel="noopener noreferrer">Facebook</a></p>
                <p><a href={teamDetails.strTwitter?.startsWith('http') ? teamDetails.strTwitter : `https://${teamDetails.strTwitter}`} target="_blank" rel="noopener noreferrer">Twitter</a></p>
                <p><a href={teamDetails.strInstagram?.startsWith('http') ? teamDetails.strInstagram : `https://${teamDetails.strInstagram}`} target="_blank" rel="noopener noreferrer">Instagram</a></p>
                <p><a href={teamDetails.strYoutube?.startsWith('http') ? teamDetails.strYoutube : `https://${teamDetails.strYoutube}`} target="_blank" rel="noopener noreferrer">YouTube</a></p>
            </div>
        </div>
    );
};


export default TeamDetails;
