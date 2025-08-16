import { API_URL } from '@/config';
import { useAuth } from '@/context/AuthContext';
import { login, checkApiHealth } from '@/services/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiStatus, setApiStatus] = useState('checking');
    const [apiDetails, setApiDetails] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const checkApi = async () => {
            console.log('Current API_URL:', API_URL);
            try {
                const isHealthy = await checkApiHealth();
                setApiStatus(isHealthy ? 'healthy' : 'unhealthy');
                setApiDetails({
                    url: API_URL,
                    status: isHealthy ? 'OK' : 'Failed'
                });
            } catch (err) {
                console.error('API check error:', err);
                setApiStatus('unhealthy');
                setApiDetails({
                    url: API_URL,
                    error: err.message
                });
            }
        };
        checkApi();
    }, []);

    const handleSubmit = async (data) => {
        try {
            setIsLoading(true);
            setError('');

            if (apiStatus !== 'healthy') {
                throw new Error(`API is currently unavailable. Please try again later. (${apiDetails?.error || 'Unknown error'})`);
            }

            console.log('Attempting login for:', data.email);
            console.log('Using API URL:', API_URL);

            const response = await login(data);

            console.log('Login successful, got token:', !!response.token);

            if (!response.token) {
                throw new Error('No authentication token received');
            }

            login({
                token: response.token,
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
                                <p>API is currently unavailable. Please try again later.</p>
                                {apiDetails && (
                                    <p className="text-sm mt-2">
                                        Details: {apiDetails.error || 'Unknown error'}
                                        <br />
                                        URL: {apiDetails.url}
                                    </p>
                                )}
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