import { Card } from "../components/ui/card";
import '../styles/dashboard.css';
import UserProfile from './UserProfile';

const Dashboard = () => {
    try {
        return (
            <section id="dashboard" className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UserProfile />
                    <Card>
                        <h1>Dashboard Content</h1>
                    </Card>
                </div>
            </section>
        )
    } catch (error) {
        throw error;
    }
}

export default Dashboard;