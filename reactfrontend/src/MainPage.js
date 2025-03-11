import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import { useFavoriteTeams } from "./context/favoritesContext";
import PrivateRoute from "./routing/PrivateRoute";
import './MainPage.css';


const MainPage = () => {

  return (
    <Router>
      <div 
        style={{ 
          background: "#1e3c72",
          // background: "linear-gradient(to bottom, #1e3c72, rgb(42, 152, 64))", 
          minHeight: "100vh" 
        }}
      >
        <NavBar />
        <div className="content-wrapper">
          <Routes>
            {/* Main Dashboard */}
            <Route path="/" element={<Dashboard />}/>

            {/* Game Details Page */}
            <Route path="/results/:gameId" element={<ResultsDetails />} />

            {/* Team Details Page */}
            <Route path='/team/:teamId' element={<TeamDetails />}/>

            {/* User Login Page */}
            <Route path='/login' element={<UserLogin />}/>

            {/* User Signup */}
            <Route path='/signup' element={<SignUp />}/>

            {/* Add More Teams to User */}
            <Route path='/add-teams' element={<TeamSelection />}/>

            {/* Not Found/Default Page */}
            <Route path='/not-found' element={<NotFound />}/>
            <Route path='*' element={<NotFound />}/>
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default MainPage;