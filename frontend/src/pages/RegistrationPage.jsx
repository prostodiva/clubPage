import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

import RegistrationForm from "../components/RegistrationForm";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";

const RegistrationPage = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        try {
            setError('');
            setSuccess('');
            console.log('Submitting registration:', data);
            const response = await authService.register(data);
            console.log('Registration successful:', response);
            setSuccess('Registration successful! You can now login.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed. Please try again.');
        }
    };

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
                        {success && (
                            <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg">
                                {success}
                            </div>
                        )}
                        <RegistrationForm onSubmit={handleSubmit} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RegistrationPage;
