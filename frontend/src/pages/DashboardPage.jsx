import React from 'react';
import { Card } from '../components/ui/card';
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";

const Dashboard = () => {
    return (
        <div>
            <Header />
            <main className="min-h-screen flex flex-col">
                <Card>
                    <h1>Dashboard page</h1>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;