import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";

const AppRoutes = () => {
    console.log('App rendering');
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
        </Routes>
    );
};

const App = () => {
    return (
        <Router>
                <AppRoutes />
        </Router>
    );
};

export default App; 