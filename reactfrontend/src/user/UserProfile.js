import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavoriteTeams } from "../context/favoritesContext";
import { useAuth } from "../context/AuthContext";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import './UserLogin.css'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL + '/'


const UserProfile = () => {
    const {userName, firstName, lastName, userEmail} = useFavoriteTeams();
    const {setIsAuthenticated, checkAuthStatus } = useAuth();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    const delete_modal_style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "auto",
        bgcolor: 'rgb(40, 80, 150)',
        border: '2px solid rgb(0, 200, 80)',
        boxShadow: 24,
        p: 4,
    };

    const onDelete = () => {
        fetch(`${BACKEND_URL}delete/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        .then((res) => {
            if (res.status === 204) {  
                setIsAuthenticated(false);
                navigate("/login");
                return;
            }
            return res.json();  
        })
        .then((data) => {
            if (data?.message) {
                console.log("Delete successful:", data.message);
            }
        })
        .catch((error) => {
            console.error("Error deleting user:", error);
        });
    };
    


    useEffect (() => {
        checkAuthStatus();
        window.scrollTo(0, 0);
    });

    return (
        <div style={{color: "white"}}>
            <h1>Profile</h1>
            <p><strong>Username:</strong> {userName}</p>
            <p><strong>First Name:</strong> {firstName}</p>
            <p><strong>Last Name:</strong> {lastName}</p>
            <p><strong>Email:</strong> {userEmail}</p>
            <div style={{display: "flex"}}>
                <Button
                    variant="contained"
                    sx={{margin: "auto", background: "#D32F2F"}}
                    onClick={() => setShowDeleteModal(!showDeleteModal)}
                >
                    DELETE ACCOUNT
                </Button>
                <Modal
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(!showDeleteModal)}
                >
                    <Box sx={delete_modal_style}>
                        <Typography variant="h6" component="h2" textAlign="center">
                            Are you sure you would like to delete your account?
                        </Typography>
                        <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                        marginTop="10px"
                        >
                            <Button 
                                variant="contained"
                                sx={{backgroundColor: "green"}}
                                onClick={() => setShowDeleteModal(false)}
                            >Cancel</Button>
                            <Button 
                                variant="contained" 
                                sx={{background: "#D32F2F", color: "white",borderColor: "#D32F2F","&:hover": {
                                    borderColor: "#B71C1C", // Darker red on hover
                                    backgroundColor: "rgba(211, 47, 47, 0.87)", // Light red background on hover
                                }}}
                                onClick={onDelete}
                            >Confirm</Button>
                        </Stack>
                    </Box>
                </Modal>
            </div>
        </div>
    );
};

export default UserProfile;