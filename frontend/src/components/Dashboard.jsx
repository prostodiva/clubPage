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
                </main>
            </section>
        )
    } catch (error) {
        throw error;
    }

}

export default Dashboard;