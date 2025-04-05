import { Navigate, Route, Routes } from "react-router-dom";
import Mission from "./components/Mission.jsx";
import Team from "./components/Team.jsx";
import { Toaster } from "./components/ui/toaster";
import DashboardPage from "./pages/DashboardPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MeetingsPage from "./pages/MeetingsPage.jsx";
import MembersPage from "./pages/MembersPage.jsx";
import RegistrationPage from "./pages/RegistrationPage.jsx";

const AppRoutes = () => {
    console.log('App rendering');
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/meetings" element={<MeetingsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/join" element={<Navigate to="/register" replace />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/team" element={<Team />} />
            <Route path="/members" element={<MembersPage />} />
        </Routes>
    );
};

const App = () => {
    return (
        <>
            <AppRoutes />
            <Toaster />
        </>
    );
};

export default App;
