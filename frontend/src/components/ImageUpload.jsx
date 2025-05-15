import { API_URL } from '@/config';
import axios from 'axios';
import { useState } from 'react';
import { Button } from "./ui/button";

const ImageUpload = ({ onImageUploaded, currentImageUrl }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(`${API_URL}/users/upload-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.imageUrl) {
                onImageUploaded(response.data.imageUrl);
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {currentImageUrl && (
                <div className="mb-4">
                    <img 
                        src={currentImageUrl} 
                        alt="Current profile" 
                        className="w-32 h-32 rounded-full object-cover"
                    />
                </div>
            )}
            <div className="flex items-center gap-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                />
                <label htmlFor="image-upload">
                    <Button 
                        type="button" 
                        variant="outline" 
                        disabled={isUploading}
                        className="cursor-pointer"
                    >
                        {isUploading ? 'Uploading...' : 'Change Image'}
                    </Button>
                </label>
            </div>
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default ImageUpload; 