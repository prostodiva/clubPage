import { Button } from "@/components/ui/button.jsx";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';
import '../styles/dashboard.css';
import UserProfile from './UserProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const Dashboard = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [newNotification, setNewNotification] = useState({
        recipient: '',
        sender: user?.userId || '',
        message: '',
        entityType: 'Announcement'
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getNotifications(user.token);
            setNotifications(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.token) {
            fetchNotifications();
        }
    }, [user?.token]);

    const handleCreateNotification = async (e) => {
        e.preventDefault();
        if (!user?.token) {
            setError('You must be logged in to create notifications');
            return;
        }

        try {
            await notificationService.createNotification({
                ...newNotification,
                sender: user.userId
            }, user.token);
            setSuccessMessage('Notification created successfully');
            setNewNotification({ 
                recipient: '',
                sender: user.userId,
                message: '',
                entityType: 'Announcement'
            });
            setDialogOpen(false);
            fetchNotifications();
        } catch (err) {
            setError('Failed to create notification');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewNotification(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!user?.token) {
        return <div>Please log in to view the dashboard</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UserProfile />
                <Card>
                    <h1>Dashboard Content</h1>
                </Card>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                {user.role === 'Admin' && (
                    <div className="mb-4 flex justify-end">
                        <Button 
                            onClick={() => setDialogOpen(true)}
                            variant="default"
                            size="lg"
                            className="font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                        >
                            + Create Notification
                        </Button>
                    </div>
                )}
                {loading ? (
                    <div>Loading notifications...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : notifications.length === 0 ? (
                    <div>No notifications found</div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map(notification => (
                            <div
                                key={notification._id}
                                className={`p-4 rounded ${
                                    notification.entityType === 'ContactRequest' ? 'bg-blue-100' :
                                    notification.entityType === 'Meeting' ? 'bg-yellow-100' :
                                    'bg-green-100'
                                }`}
                            >
                                <h3 className="font-semibold">{notification.entityType}</h3>
                                <p>{notification.message}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Create New Notification</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateNotification} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="recipient" className="text-sm font-medium text-gray-700">Recipient</label>
                            <Input
                                id="recipient"
                                name="recipient"
                                value={newNotification.recipient}
                                onChange={handleInputChange}
                                placeholder="Enter recipient ID"
                                required
                                className="w-full bg-white border-gray-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                            <Textarea
                                id="message"
                                name="message"
                                value={newNotification.message}
                                onChange={handleInputChange}
                                placeholder="Enter notification message"
                                required
                                className="w-full bg-white border-gray-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="entityType" className="text-sm font-medium text-gray-700">Type</label>
                            <select
                                id="entityType"
                                name="entityType"
                                value={newNotification.entityType}
                                onChange={handleInputChange}
                                className="w-full bg-white border-gray-300"
                            >
                                <option value="Announcement">Announcement</option>
                                <option value="Meeting">Meeting</option>
                                <option value="ContactRequest">Contact Request</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                className="text-gray-700 border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                            >
                                Create Notification
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Dashboard;