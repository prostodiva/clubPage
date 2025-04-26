import { Button } from "@/components/ui/button.jsx";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import notificationService from '../services/notificationService';
import userService from '../services/userService';
import '../styles/dashboard.css';
import Chat from './Chat';
import UserProfile from './UserProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const Dashboard = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [newNotification, setNewNotification] = useState({
        recipient: '',
        sender: user?.userId || '',
        message: '',
        entityType: 'Announcement',
        isBroadcast: false
    });
    const [newChat, setNewChat] = useState({
        title: '',
        participants: []
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [chatDialogOpen, setChatDialogOpen] = useState(false);
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

    const fetchChats = async () => {
        try {
            setLoading(true);
            const data = await chatService.getAllChats(user.token);
            setChats(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch chats');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        if (!user?.token) return;
        
        try {
            const users = await userService.getAllUsers(user.token);
            setAllUsers(users);
        } catch (err) {
            setError('Failed to fetch users');
        }
    };

    useEffect(() => {
        if (user?.token) {
            fetchNotifications();
            fetchChats();
            fetchAllUsers();
        }
    }, [user?.token]);

    const handleCreateNotification = async (e) => {
        e.preventDefault();
        if (!user?.token) {
            setError('You must be logged in to create notifications');
            return;
        }

        try {
            if (newNotification.isBroadcast) {
                await notificationService.broadcastNotification({
                    message: newNotification.message,
                    entityType: newNotification.entityType
                }, user.token);
            } else {
                await notificationService.createNotification({
                    ...newNotification,
                    sender: user.userId
                }, user.token);
            }
            setSuccessMessage('Notification created successfully');
            setNewNotification({ 
                recipient: '',
                sender: user.userId,
                message: '',
                entityType: 'Announcement',
                isBroadcast: false
            });
            setDialogOpen(false);
            fetchNotifications();
        } catch (err) {
            setError('Failed to create notification');
        }
    };

    const handleCreateChat = async (e) => {
        e.preventDefault();
        if (!user?.token) {
            setError('You must be logged in to create chats');
            return;
        }

        try {
            await chatService.createChat(newChat, user.token);
            setSuccessMessage('Chat created successfully');
            setNewChat({ title: '', participants: [] });
            setChatDialogOpen(false);
            fetchChats();
        } catch (err) {
            setError('Failed to create chat');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewNotification(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeleteChat = async (chatId) => {
        if (!user?.token) {
            setError('You must be logged in to delete chats');
            return;
        }

        if (!chatId) {
            setError('Please select a chat to delete');
            return;
        }

        try {
            await chatService.deleteChat(chatId, user.token);
            setSuccessMessage('Chat deleted successfully');
            setSelectedChatId(null); // Clear the selected chat after deletion
            fetchChats(); // Refresh the chat list after deletion
        } catch (err) {
            setError('Failed to delete chat');
        }
    };

    const handleChatInputChange = (e) => {
        const { name, value } = e.target;
        setNewChat(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChatClick = (chatId) => {
        setSelectedChatId(chatId);
    };

    const handleAddAllUsers = () => {
        const allUserIds = allUsers.map(user => user._id);
        setNewChat(prev => ({
            ...prev,
            participants: allUserIds
        }));
    };

    const handleLeaveChat = async (chatId) => {
        if (!user?.token) {
            setError('You must be logged in to leave chats');
            return;
        }

        try {
            await chatService.leaveChat(chatId, user.token);
            setSuccessMessage('Successfully left the chat');
            fetchChats();
        } catch (err) {
            setError('Failed to leave chat');
        }
    };

    if (!user?.token) {
        return <div>Please log in to view the dashboard</div>;
    }

    return (
        <div className="container mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {successMessage}
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UserProfile />
                
                <Card>
                    <CardHeader>
                        <CardTitle>Chats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <Button 
                                onClick={() => setChatDialogOpen(true)}
                                variant="default"
                                size="lg"
                                className="font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                            >
                                + Create Chat
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {chats.map(chat => (
                                <div
                                    key={chat._id}
                                    className={`p-4 rounded bg-white border shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                                        selectedChatId === chat._id ? 'border-blue-500 bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div 
                                            className="flex-grow"
                                            onClick={() => handleChatClick(chat._id)}
                                        >
                                            <h3 className="font-semibold">{chat.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                {chat.participants?.length || 0} participants
                                            </p>
                                            {chat.lastMessage && (
                                                <p className="text-sm mt-2">
                                                    Last message: {chat.lastMessage.content}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            {user.role === 'Admin' ? (
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteChat(chat._id);
                                                    }}
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Delete
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLeaveChat(chat._id);
                                                    }}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Leave
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {selectedChatId && (
                    <Card className="col-span-2">
                        <Chat selectedChatId={selectedChatId} />
                    </Card>
                )}
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
                        {!newNotification.isBroadcast && (
                            <div className="space-y-2">
                                <label htmlFor="recipient" className="text-sm font-medium text-gray-700">Recipient</label>
                                <Input
                                    id="recipient"
                                    name="recipient"
                                    value={newNotification.recipient}
                                    onChange={handleInputChange}
                                    placeholder="Enter recipient ID"
                                    required={!newNotification.isBroadcast}
                                    className="w-full bg-white border-gray-300"
                                />
                            </div>
                        )}
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
                        {user.role === 'Admin' && (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isBroadcast"
                                    name="isBroadcast"
                                    checked={newNotification.isBroadcast}
                                    onChange={(e) => handleInputChange({
                                        target: {
                                            name: 'isBroadcast',
                                            value: e.target.checked
                                        }
                                    })}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label htmlFor="isBroadcast" className="text-sm font-medium text-gray-700">
                                    Send to all users
                                </label>
                            </div>
                        )}
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

            <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Create New Chat</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateChat} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium text-gray-700">Chat Title</label>
                            <Input
                                id="title"
                                name="title"
                                value={newChat.title}
                                onChange={handleChatInputChange}
                                placeholder="Enter chat title"
                                required
                                className="w-full bg-white border-gray-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="participants" className="text-sm font-medium text-gray-700">Participants (comma-separated IDs)</label>
                            <div className="flex space-x-2">
                                <Input
                                    id="participants"
                                    name="participants"
                                    value={newChat.participants.join(',')}
                                    onChange={(e) => handleChatInputChange({
                                        target: {
                                            name: 'participants',
                                            value: e.target.value.split(',').map(id => id.trim())
                                        }
                                    })}
                                    placeholder="Enter participant IDs"
                                    required
                                    className="w-full bg-white border-gray-300"
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddAllUsers}
                                    variant="outline"
                                    className="whitespace-nowrap"
                                >
                                    Add All Users
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setChatDialogOpen(false)}
                                className="text-gray-700 border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                            >
                                Create Chat
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Dashboard;