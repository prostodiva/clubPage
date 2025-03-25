import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from "../components/LoginForm";
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth';
import Header from "../components/Header";
import Footer from "../components/Footer";

const LoginPage = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (data) => {
        try {
            setError('');
            const response = await authService.login(data);
            console.log('Login successful:', response);
            login(response);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
            console.error('Login error:', err);
        }
    }

    return (
        <div>
            <Header />
            <main>
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="w-full max-w-md">
                        {error && (
                            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                                {error}
                            </div>
                        )}
                        <LoginForm onSubmit={handleSubmit} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default LoginPage