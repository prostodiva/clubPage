import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ImageUpload from './ImageUpload';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const UserProfile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('UserProfile mounted, user:', user); // Debug log

        const fetchProfile = async () => {
            if (!user?.userId) {
                console.log('No user ID available'); // Debug log
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching profile for user:', user.userId); // Debug log
                const response = await axios.get(`${API_URL}/users/info/${user.userId}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                console.log('Profile data received:', response.data); // Debug log
                setProfileData(response.data);
            } catch (err) {
                console.error('Error details:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status
                });
                setError(err.response?.data?.message || 'Failed to fetch profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleImageUploaded = (newImageUrl) => {
        setProfileData(prev => ({
            ...prev,
            profileImageUrl: newImageUrl
        }));
    };

    if (loading) {
        return <div className="p-4">Loading profile...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    if (!profileData) {
        return <div className="p-4">No profile data available</div>;
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold">Name</h3>
                        <p>{profileData.name}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Email</h3>
                        <p>{profileData.email}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Profile Image</h3>
                        <ImageUpload 
                            currentImageUrl={profileData.profileImageUrl}
                            onImageUploaded={handleImageUploaded}
                        />
                    </div>
                    {profileData.commonClubIds && profileData.commonClubIds.length > 0 && (
                        <div>
                            <h3 className="font-semibold">Common Clubs</h3>
                            <p>{profileData.commonClubIds.length} clubs in common</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default UserProfile; 