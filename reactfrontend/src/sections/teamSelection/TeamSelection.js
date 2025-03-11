import React, { useState, useEffect, useContext, useCallback } from "react";
import { data, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { MdCancel } from "react-icons/md";
import './TeamSelection.css';
// import { useFavoriteTeams } from "../../context/favoritesContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL + '/'


const TeamSelection = () => {
    // const { favoriteTeams, setFavoriteTeams } = useFavoriteTeams();
    const [sports, setSports] = useState([]);
    const [countries, setCountries] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamDetails, setTeamDetails] = useState({});
    const [selectedSport, setSelectedSport] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedLeague, setSelectedLeague] = useState("");
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [selectedSingleTeam, setSelectedSingleTeam] = useState("");
    // const token = localStorage.get("token");
    const navigate = useNavigate();


    const fetchSports = useCallback(async () => {
        fetch(`${BACKEND_URL}sports`)
        .then((res) => res.json())
        .then((data) => {
            setSports(data.sports);
        })
        .catch((err) => console.error("Error fetching sports:", err));
    }, []);

    const fetchTeam = useCallback(async (teamId) => {
        try {
            const res = await fetch(`${BACKEND_URL}team_details?team_id=${teamId}`);
            const data = await res.json();
            console.log(data);
            return data.teams[0] || null; // ✅ Now correctly returning the result
        } catch (err) {
            console.error("Error fetching team:", err);
            return null;
        }
    }, []);

    const sportLogoUrl = (sport) => {
        return `https://www.thesportsdb.com/images/icons/sports/${sport.replace(" ", "").toLowerCase()}.png`
    };

    useEffect(() => {
        const fetchAllTeams = async () => {
            const details = {};
            for (const team of selectedTeams) {
                details[team] = await fetchTeam(team); // Wait for each fetch
            }
            setTeamDetails(details); // Store in state
        };
    
        if (selectedTeams.length > 0) {
            fetchAllTeams();
        }
    }, [selectedTeams]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchSports();
    }, []);

    const onSave = () => {
        fetch(`${BACKEND_URL}update_favorites/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${token}`, // Assuming authToken is accessible
            },
            // body: JSON.stringify({ favorite_team_ids: selectedTeams.map(team => team.idTeam) }),
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to update favorites");
            }
            return res.json();
        })
        .then((data) => {
            // setFavoriteTeams(selectedTeams); // Update context with saved teams
        })
        .then(navigate("/dashboard"))
        .catch((err) => console.error("Error updating favorite teams:", err));
    };

    const handleAddTeam = () => {
        if (selectedTeams.length > 9) {
            window.alert("You have hit the max of 10 teams. Please remove a team from below to add more.");
            return;
        }
        if (selectedTeams.includes(selectedSingleTeam)) {
            window.alert("Team is already in your favorites!");
            return;
        }
        setSelectedTeams([...selectedTeams, selectedSingleTeam])
    };

    const handleRemoveTeam = (teamId) => {
        
        setSelectedTeams((prevTeams) => prevTeams.filter((team) => team !== teamId));
    };

    const handleClearFilters = () => {
        setSelectedSport("");
    };
    
    
    // const onCancel = () => {
    //     setSelectedTeams(favoriteTeams); // Reset selection to previously saved teams
    //     navigate("/dashboard"); // Redirect user back to the dashboard
    // };

    
    
    useEffect(() => {
        setSelectedCountry("");
        setSelectedLeague("");
        setSelectedSingleTeam("");
        if (selectedSport) {
            fetch(`${BACKEND_URL}countries`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}`
                }
            })
            .then((res) => res.json())
            .then((data) => {
                const us = data.countries.find(c => c.name_en === "United States");
                const rest = data.countries.filter(c => c.name_en !== "United States");
            
                setCountries(us ? [us, ...rest] : rest);
            })
            .catch((err) => console.error("Error fetching countries:", err));
        } else {
            setCountries([]);
            }
        }, [selectedSport]);

        useEffect(() => {
            setSelectedLeague("");
            setSelectedSingleTeam("");
            if (selectedCountry) {
                fetch(`${BACKEND_URL}leagues_by_country?country=${selectedCountry}&sport=${selectedSport}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${token}`
                    }
                })
                .then((res) => res.json())
                .then((data) => setLeagues(data.countries || []))
                .catch((err) => console.error("Error fetching leagues", err))
            } else {
                setLeagues([])
            }
        }, [selectedCountry]);

        useEffect(() => {
            if (selectedLeague) {
                fetch(`${BACKEND_URL}teams_by_league?league_id=${selectedLeague}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${token}`
                    }
                })
                .then((res) => res.json())
                .then((data) => setTeams(data.teams || []))
            } else {
                setTeams([])
            }
        }, [selectedLeague]);
    

    return (
        <div className="team-selection-container" style={{color: "white"}}>
            <h2>Select Your Favorite Teams</h2>
            <Box sx={{ minWidth: 120, maxWidth: 280 }}>
                <FormControl fullWidth>
                    <InputLabel id="sport-label">Sport</InputLabel>
                    <Select
                        labelId="sport-label"
                        id="sport-select"
                        value={selectedSport}
                        label="Sport"
                        onChange={(e) => setSelectedSport(e.target.value)}
                    >
                        {sports.map((sport) => (
                            <MenuItem key={sport} value={sport}><img src={sportLogoUrl(sport)} style={{height: "20px", width:"20px", marginRight: "5px"}}/>{sport}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth style={{marginTop: "30px"}}>
                    <InputLabel id="country-label">Country</InputLabel>
                    <Select
                        labelId="country-label"
                        id="country-select"
                        value={selectedCountry}
                        label="Country"
                        onChange={(e) => setSelectedCountry(e.target.value)}
                    >
                        {countries.map((country) => (
                            <MenuItem key={country.name_en} value={country.name_en}><img src={country.flag_url_32} style={{height: "24px", width: "24px", marginRight: "5px"}}/>{country.name_en}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth style={{marginTop: "30px"}}>
                    <InputLabel id="league-label">League</InputLabel>
                    <Select
                        labelId="league-label"
                        id="league-select"
                        value={selectedLeague}
                        label="League"
                        onChange={(e) => setSelectedLeague(e.target.value)}
                    >
                        {leagues.map((league) => (
                            <MenuItem key={league.idLeague} value={league.idLeague}><img style={{height: "20px", width:"20px", marginRight: "5px"}}src={league.strBadge + "/preview"}/>{league.strLeague}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth style={{marginTop: "30px"}}>
                    <InputLabel id="team-label">Team</InputLabel>
                    <Select
                        labelId="team-label"
                        id="team-select"
                        value={selectedSingleTeam}
                        label="Team"
                        onChange={(e) => setSelectedSingleTeam(e.target.value)}
                    >
                        {teams.map((team) => (
                            <MenuItem key={team.idTeam} value={team.idTeam}><img style={{height: "20px", width:"20px", marginRight: "5px"}}src={team.strBadge + "/preview"}/>{team.strTeam}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <div style={{marginTop: "25px"}}>
                <Stack direction="row" spacing={2}>
                    <Button 
                    variant="contained"
                    disabled={selectedSingleTeam !== "" ? false : true}
                    onClick={handleAddTeam}
                    >Add Team</Button>
                    <Button variant="outlined" onClick={handleClearFilters}>Clear Filters</Button>
                </Stack>
                {/* <button className="see-more-button" onClick={handleAddTeam} disabled={selectedSingleTeam !== "" ? false : true}>Add Team</button>
                <button className="see-more-button" onClick={handleClearFilters}>Clear Filters</button> */}
            </div>
            <h3>Selected Teams:</h3>
            <div style={{display: "flex", flexWrap: "wrap"}}>
                {selectedTeams.map((team) => {
                    const team_details = teamDetails[team];
                    console.log(teamDetails);
                    if (!team_details) return <p key={team}>Loading...</p>;
                    return(
                        <div className="selected-team-div" key={team_details.idTeam}>
                            <img src={team_details.strBadge + '/preview'} style={{height: "50px", width:"50px"}}/>
                            <button className="remove-button"
                            style={{display: "contents", cursor: "pointer", color: "white"}}
                            onClick={() => handleRemoveTeam(team_details.idTeam)}
                            >
                                <MdCancel/>
                            </button>
                        </div>
                    );
                })}
            </div>
            <div style={{marginTop: "25px"}}>
                <Stack direction="row" spacing={2}>
                    <Button 
                    variant="contained"
                    sx={{backgroundColor: "green"}}
                    >Save</Button>
                    <Button 
                    variant="outlined" 
                    sx={{color: "#D32F2F", borderColor: "#D32F2F","&:hover": {
                        borderColor: "#B71C1C", // Darker red on hover
                        backgroundColor: "rgba(211, 47, 47, 0.1)", // Light red background on hover
                    }}}>Cancel Changes</Button>
                </Stack>
                {/* <button className="see-more-button" onClick={handleAddTeam} disabled={selectedSingleTeam !== "" ? false : true}>Add Team</button>
                <button className="see-more-button" onClick={handleClearFilters}>Clear Filters</button> */}
            </div>
        </div>
    );
};

export default TeamSelection;
