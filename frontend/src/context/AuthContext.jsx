import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            // Check for stored user data on mount
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                // Validate user data structure
                if (isValidUserData(parsedUser)) {
                    setUser(parsedUser);
                } else {
                    console.warn('Invalid user data found in localStorage');
                    localStorage.removeItem('user');
                }
            }
        } catch (error) {
            console.error('Error loading auth state:', error);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }, []);

    // Validate user data structure
    const isValidUserData = (data) => {
        return (
            data &&
            typeof data === 'object' &&
            typeof data.id === 'string' &&
            typeof data.email === 'string'
        );
    };

    const login = (userData) => {
        try {
            if (!isValidUserData(userData)) {
                throw new Error('Invalid user data provided to login');
            }
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    const logout = () => {
        try {
            setUser(null);
            localStorage.removeItem('user');
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