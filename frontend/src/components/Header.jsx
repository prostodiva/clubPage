"use client"

import "../styles/fonts.css"
import logo from '../assets/logo1.png';
import { Link } from "react-router-dom"
import "../styles/header.css"
import { useState } from "react"
import {useAuth} from "@/context/AuthContext.jsx";
import { animate } from "https://cdn.jsdelivr.net/npm/motion@12.6.2/+esm";
import { Button } from "../components/ui/button.jsx";

const handleLogoHover = (isHovering) => {
    if (isHovering) {
        animate(".logoAnimation", {
            scale: [1, 1.2, 1],
            duration: 1,
            ease: "easeInOut"
        });
    }
};


const Header = () => {
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)

    const { user, logout } = useAuth();
    const isLoggedIn = !!user;

    const handleLogout = () => {
        console.log("logged out");
        logout();
    };

    const scrollToTeam = () => {
        const teamSection = document.getElementById('team-section');
        const headerHeight = 64;

        window.scrollTo({
            top: teamSection.offsetTop - headerHeight,
            behavior: 'smooth'
        });
    };

    const scrollToMission = () => {
        const missionSection = document.getElementById('mission-section');
        const headerHeight = 64;

        window.scrollTo({
            top: missionSection.offsetTop - headerHeight,
            behavior: 'smooth'
        })
    }

    return (
        <header className="header">
            <div className="header-container">
                <div className="left-section">
                    <div
                        className="logoAnimation"
                        onMouseEnter={() => handleLogoHover(true)}
                        style={{ cursor: "pointer" }}
                    >
                        <Link to="/" className="logo">
                            <img src={logo || "/placeholder.svg"} alt="logo" className="logo"></img>
                        </Link>
                    </div>

                    {/* Use a simple div-based navigation instead of Radix UI */}
                    <div className="nav-menu">
                        <ul className="nav-list">
                            <li className="nav-item">
                                <button
                                    className="nav-link-about"
                                    onMouseEnter={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                                >
                                    ABOUT
                                </button>
                                {aboutDropdownOpen && (
                                    <div className="dropdown-content-wrapper"
                                         onMouseLeave={() => setAboutDropdownOpen(false)}
                                    >
                                        <ul className="dropdown-content">
                                            <li>
                                                <Button onClick={scrollToMission} className="dropdown-link" to="/mission">
                                                    mission
                                                </Button>
                                            </li>
                                            <li>
                                                <Button className="dropdown-link" onClick={scrollToTeam} to="/team">
                                                    team
                                                </Button>
                                            </li>
                                            <li>
                                                <Link to="/members" className="dropdown-link">
                                                    members
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </li>

                            <li className="nav-item">
                                <Link to="/events" className="nav-link">
                                    EVENTS
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/Meetings" className="nav-link">
                                    MEETINGS
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/join" className="nav-link">
                                    JOIN
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="auth-buttons">
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard" className="dashboard-button">
                                DASHBOARD
                            </Link>
                            <button
                            className="logout-button"
                            onClick={handleLogout}
                            type="button"
                        >
                            SIGN OUT
                        </button>
                        </>

                    ) : (
                        <>
                            <Link to="/login" className="login-button">
                                LOGIN
                            </Link>
                            <Link to="/register" className="register-button">
                                REGISTER
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header


