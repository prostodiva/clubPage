import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from "../components/LoginForm";
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth';
import Header from "../components/Header";
import Footer from "../components/Footer";

const LoginPage = () => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (data) => {
        try {
            setIsLoading(true);
            setError('');

            console.log('Attempting login for:', data.email);

            const response = await authService.login(data);

            console.log('Login successful, got token:', !!response.token);

            // Make sure we have a token before calling login
            if (!response.token) {
                throw new Error('No authentication token received');
            }

            // Call the auth context login with the response
            login({
                token: response.token,
                // Add any other user data you need
            });

            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <main>
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="w-full max-w-md">
                        <LoginForm
                            onSubmit={handleSubmit}
                            error={error}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;