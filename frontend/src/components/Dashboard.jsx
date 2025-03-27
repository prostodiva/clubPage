import { Card } from "../components/ui/card";
import React from "react";
import '../styles/dashboard.css';

const Dashboard = () => {
    try {
        return (
            <section id="dashboard">
                <main className="main">
                    <Card>
                        <h1>Dashboard page</h1>
                    </Card>
                    <div className="dash-buttons">
                            <button className="logout-button">Sign Out</button>
                    </div>
                    <div className="dash-buttons">
                            <button className="dash-button">Dashboard</button>
                    </div>
                </main>
            </section>
        )
    } catch (error) {
        throw error;
    }

}

export default Dashboard;