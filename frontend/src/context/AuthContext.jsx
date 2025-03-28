import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            // Check for stored token on mount
            const token = localStorage.getItem('token');
            if (token) {
                // Decode the token to get userId
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    token,
                    userId: payload.userId
                });
            }
        } catch (error) {
            console.error('Error loading auth state:', error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        try {
            if (!userData.token) {
                throw new Error('No token provided');
            }

            // Decode the token to get userId
            const payload = JSON.parse(atob(userData.token.split('.')[1]));

            // Store token in localStorage
            localStorage.setItem('token', userData.token);

            // Set user data with userId
            setUser({
                token: userData.token,
                userId: payload.userId
            });
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    const logout = () => {
        try {
            setUser(null);
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const contextValue = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;