"use client"

import "../styles/fonts.css"
import logo from '../assets/logo.png';
import { Link } from "react-router-dom"
import "../styles/header.css"
import { useState } from "react"
import {useAuth} from "@/context/AuthContext.jsx";
import { animate } from "https://cdn.jsdelivr.net/npm/motion@12.6.2/+esm";

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
                                {/* Toggle dropdown on click */}
                                <button
                                    className="nav-link-about"
                                    onMouseEnter={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                                >
                                    ABOUT
                                </button>

                                {/* Show dropdown based on state */}
                                {aboutDropdownOpen && (
                                    <div className="dropdown-content-wrapper">
                                        <ul className="dropdown-content">
                                            <li>
                                                <Link to="/mission" className="dropdown-link">
                                                    Our Mission
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/team" className="dropdown-link">
                                                    Our Team
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/members" className="dropdown-link">
                                                    Members
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
                                Dashboard
                            </Link>
                            <button
                            className="logout-button"
                            onClick={handleLogout}
                            type="button"
                        >
                            Sign Out
                        </button>
                        </>

                    ) : (
                        <>
                            <Link to="/login" className="login-button">
                                Login
                            </Link>
                            <Link to="/register" className="register-button">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header


