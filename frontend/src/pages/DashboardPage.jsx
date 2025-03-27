import React from 'react';
import Dashboard from "../components/Dashboard";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const DashboardPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
                <main className="flex-grow">
                   <Dashboard />
                </main>
            <Footer />
        </div>
    );
}

export default DashboardPage;