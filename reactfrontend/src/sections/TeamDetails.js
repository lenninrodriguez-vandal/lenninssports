import { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";
import "./TeamDetails.css";

const TeamDetails = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const teamDetails = location.state?.teamDetails
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL + '/'

    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showAllPlayers, setShowAllPlayers] = useState(false);
    const [showAllNews, setShowAllNews] = useState(false);
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [teamCoach, setTeamCoach] = useState({});
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [pastResults, setPastResults] = useState([]);
    const [rssArticles, setRSSArticles] = useState([]);
    const [upcomingLoading, setUpcomingLoading] = useState(true);
    const [pastLoading, setPastLoading] = useState(true);
    const [rssLoading, setRSSLoading] = useState(true);

    const formatTime = (timestamp) => {
        return new Date(timestamp + "Z").toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).replace(" ", ""); // Removes the space before AM/PM
      };
    
    const formatDate = (timestamp) => {
        return new Date(timestamp + "Z").toLocaleDateString("en-US", {
          day: "numeric",
          month: "short"
        });
      };
    

    const fetchPlayers = useCallback(async () => {
        try {
            const players = await fetch(`${BACKEND_URL}players_by_team?team_id=${encodeURIComponent(teamId)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });
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

    const fetchRSS = useCallback(async () => {
        if (teamDetails.strRSS === "") {
            setRSSArticles([])
            setRSSLoading(false)
            return
        }
        try {
          const response = await fetch(`${BACKEND_URL}team_rss?url=${encodeURIComponent(teamDetails.strRSS)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
          });

          const data = await response.json();
          setRSSArticles(data.rss_feed);
        } catch (error) {
          console.error("Error fetching RSS feed:", error);
        } finally {
          setRSSLoading(false);
        }
      }, [BACKEND_URL, teamDetails.strRSS]);

    const fetchTeamGames = useCallback(async () =>{
        try {
            const upcomingTeamGames = await fetch(`${BACKEND_URL}upcoming_games?team_id=${encodeURIComponent(teamId)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            const pastTeamGames = await fetch (`${BACKEND_URL}past_games?team_id=${encodeURIComponent(teamId)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            
            const upcomingData = await upcomingTeamGames.json();
            const pastData = await pastTeamGames.json();

            let upcoming = upcomingData?.events || [];
            let past = pastData?.results || [];

            setUpcomingGames(upcoming);
            setUpcomingLoading(false);
            setPastResults(past);
            setPastLoading(false);
        } catch (error) {
            console.error("Error fetching team games:", error)
        }
    }, [BACKEND_URL, teamId]);
    

    useEffect(() => {
        if (!teamDetails) {
            navigate("/not-found");
        }
        fetchPlayers();
        fetchTeamGames();
        fetchRSS();
        window.scrollTo(0, 0);
        // eslint-disable-next-line
    }, [teamDetails, navigate, fetchPlayers, fetchTeamGames]);

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
                {teamDetails.strColour1 && (
                    <div className="color-box" style={{ backgroundColor: teamDetails.strColour1 }}></div>
                )}
                {teamDetails.strColour2 && (
                    <div className="color-box" style={{ backgroundColor: teamDetails.strColour2 }}></div>
                )}
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
            <div className="upcoming-games">
            <h3>Upcoming</h3>

            {upcomingLoading ? (
                <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                    <PacmanLoader color="#3498db" size={25} />
                </div>
            ) : upcomingGames && upcomingGames.length > 0 ? (
                <table style={{ width: "100%" }}>
                    <tbody>
                        {upcomingGames.map((game) => (
                            <tr key={game.idEvent} className="upcoming-games-card">
                                <td style={{ width: "10%" }}>{formatDate(game.strTimestamp)}</td>
                                <td align="right" style={{ width: "25%" }}>
                                    <div style={{ justifyContent: "flex-end" }}>
                                        <p>{game.strHomeTeam}</p>
                                        <img src={game.strHomeTeamBadge} alt={game.strHomeTeam} />
                                    </div>
                                </td>
                                <td align="center" style={{ width: "15%", maxWidth: "80" }}> - </td>
                                <td align="left" style={{ width: "25%" }}>
                                    <div>
                                        <img src={game.strAwayTeamBadge} alt={game.strAwayTeam} />
                                        <p>{game.strAwayTeam}</p>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <img src={game.strLeagueBadge} alt={game.strLeague} />
                                        <p>{formatTime(game.strTimestamp)}</p>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No upcoming games.</p>
            )}
        </div>
            <div className="past-games">
                <h3>Results</h3>
                {pastLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                        <PacmanLoader color="#3498db" size={25} />
                    </div>
                ) : pastResults && pastResults.length > 0 ? (
                    <table style={{width: "100%"}}>
                        <tbody>
                        {pastResults.map((game) => (
                            <tr key={game.idEvent} className="upcoming-games-card">
                                <td style={{width: "10%"}}>{formatDate(game.strTimestamp)}</td>
                                <td align="right" style={{width: "25%"}}><div style={{justifyContent: "flex-end"}}><p>{game.strHomeTeam}</p><img src={game.strHomeTeamBadge} alt={game.strHomeTeam}/></div></td>
                                <td align="center" style={{width: "15%", maxWidth: "80"}}><strong>{game.intHomeScore} - {game.intAwayScore}</strong></td>
                                <td align="left" style={{width: "25%"}}><div><img src={game.strAwayTeamBadge} alt={game.strAwayTeam}/><p>{game.strAwayTeam}</p></div></td>
                                <td><div><img src={game.strLeagueBadge} alt={game.strLeague}/></div></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No past results available.</p> 
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
                        {teamPlayers.slice(0, showAllPlayers ? teamPlayers.length : 10).map((player) => (
                            <div key={player.idPlayer} className="player-card">
                                <img src={player.strCutout ? player.strCutout + '/preview' : '/PlayerFranny.png'} alt={player.strPlayer} />
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
            <div className="rss-feed">
            <h2>{teamDetails.strTeam} News</h2>
            {rssLoading ? (
                <p>Loading...</p>
            ) : rssArticles.length > 0 ? (
                <ul>
                {rssArticles.slice(0, showAllNews ? rssArticles.length : 5).map((article, index) => (
                    <li key={index}>
                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                        {article.title}
                    </a>
                    <br />
                    <small>{new Date(article.pubDate).toLocaleString()}</small>
                    </li>
                ))}
                </ul>
            ) : (
                <p>No articles found.</p>
            )}
            {rssArticles.length > 5 && (
                    <button className="see-more-button" onClick={() => setShowAllNews(!showAllNews)}>
                        {showAllNews ? "See Less" : "See More"}
                    </button>
            )}
            </div>
            <div className="team-socials">
                {teamDetails.strWebsite && (
                    <p><a href={teamDetails.strWebsite?.startsWith('http') ? teamDetails.strWebsite : `https://${teamDetails.strWebsite}`} target="_blank" rel="noopener noreferrer">Official Website</a></p>   
                )}
                {teamDetails.strFacebook && (
                    <p><a href={teamDetails.strFacebook?.startsWith('http') ? teamDetails.strFacebook : `https://${teamDetails.strFacebook}`} target="_blank" rel="noopener noreferrer">Facebook</a></p>
                )}
                {teamDetails.strTwitter && (
                    <p><a href={teamDetails.strTwitter?.startsWith('http') ? teamDetails.strTwitter : `https://${teamDetails.strTwitter}`} target="_blank" rel="noopener noreferrer">Twitter</a></p>
                )}
                {teamDetails.strInstagram && (
                    <p><a href={teamDetails.strInstagram?.startsWith('http') ? teamDetails.strInstagram : `https://${teamDetails.strInstagram}`} target="_blank" rel="noopener noreferrer">Instagram</a></p>
                )}
                {teamDetails.strYoutube && (
                    <p><a href={teamDetails.strYoutube?.startsWith('http') ? teamDetails.strYoutube : `https://${teamDetails.strYoutube}`} target="_blank" rel="noopener noreferrer">YouTube</a></p>
                )}
            </div>
        </div>
    );
};


export default TeamDetails;
