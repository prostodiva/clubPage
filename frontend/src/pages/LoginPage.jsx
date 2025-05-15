import { useAuth } from '@/context/AuthContext';
import { authService, checkApiHealth } from '@/services/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiStatus, setApiStatus] = useState('checking');
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const checkApi = async () => {
            const isHealthy = await checkApiHealth();
            setApiStatus(isHealthy ? 'healthy' : 'unhealthy');
        };
        checkApi();
    }, []);

    const handleSubmit = async (data) => {
        try {
            setIsLoading(true);
            setError('');

            if (apiStatus !== 'healthy') {
                throw new Error('API is currently unavailable. Please try again later.');
            }

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
                        {apiStatus === 'checking' && (
                            <div className="text-center mb-4">Checking API status...</div>
                        )}
                        {apiStatus === 'unhealthy' && (
                            <div className="text-center text-red-600 mb-4">
                                API is currently unavailable. Please try again later.
                            </div>
                        )}
                        <LoginForm
                            onSubmit={handleSubmit}
                            error={error}
                            isLoading={isLoading}
                            disabled={apiStatus !== 'healthy'}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;