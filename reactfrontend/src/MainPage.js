import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import React from "react";
import NavBar from "./NavBar";
import Dashboard from "./sections/Dashboard";
import ResultsDetails from "./sections/ResultsDetails";
import TeamDetails from "./sections/TeamDetails";
import TeamSelection from "./sections/teamSelection/TeamSelection";
import NotFound from "./NotFound";
import UserLogin from "./user/UserLogin";
import SignUp from "./user/SignUp";
import Footer from "./Footer";
import PrivateRoute from "./routing/PrivateRoute";
import { FavoriteTeamsProvider } from "./context/favoritesContext"; // Wrap private routes in context
import { AuthProvider } from "./context/AuthContext";
import './MainPage.css';

const MainPage = () => {
  return (
    <AuthProvider>
      <Router>
        <div 
          style={{ 
            background: "#1e3c72",
            minHeight: "100vh" 
          }}
        >
          <NavBar />
          <div className="content-wrapper">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Private Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={
                  <FavoriteTeamsProvider>
                    <Dashboard />
                  </FavoriteTeamsProvider>
                }/>
                <Route path="/results/:gameId" element={
                  <FavoriteTeamsProvider>
                    <ResultsDetails />
                  </FavoriteTeamsProvider>
                }/>
                <Route path="/team/:teamId" element={
                  <FavoriteTeamsProvider>
                    <TeamDetails />
                  </FavoriteTeamsProvider>
                }/>
                <Route path="/add-teams" element={
                  <FavoriteTeamsProvider>
                    <TeamSelection />
                  </FavoriteTeamsProvider>
                }/>
              </Route>

              {/* Fallback */}
              <Route path="/not-found" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default MainPage;
