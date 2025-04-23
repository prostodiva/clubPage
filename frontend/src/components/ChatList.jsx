import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';

const ChatList = ({ onSelectChat, selectedChatId }) => {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNewChatDialog, setShowNewChatDialog] = useState(false);
    const [newChatTitle, setNewChatTitle] = useState('');
    const [participants, setParticipants] = useState('');

    useEffect(() => {
        fetchChats();
    }, [user?.token]);

    const fetchChats = async () => {
        if (!user?.token) return;

        try {
            const response = await chatService.getAllChats(user.token);
            setChats(response.data);
        } catch (err) {
            setError('Failed to load chats');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateChat = async (e) => {
        e.preventDefault();
        if (!newChatTitle.trim()) return;

        try {
            const participantIds = participants
                .split(',')
                .map(id => id.trim())
                .filter(Boolean);

            const newChat = await chatService.createChat(
                {
                    title: newChatTitle.trim(),
                    participants: participantIds
                },
                user.token
            );

            setChats([...chats, newChat.data]);
            setShowNewChatDialog(false);
            setNewChatTitle('');
            setParticipants('');
            onSelectChat(newChat.data._id);
        } catch (err) {
            setError('Failed to create chat');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white border-r">
            <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Chats</h2>
                    <button
                        onClick={() => setShowNewChatDialog(true)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                    >
                        New Chat
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                    <div className="text-center text-gray-500 mt-4">
                        No chats available
                    </div>
                ) : (
                    <div className="space-y-1">
                        {chats.map((chat) => (
                            <button
                                key={chat._id}
                                onClick={() => onSelectChat(chat._id)}
                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none ${
                                    selectedChatId === chat._id ? 'bg-blue-50' : ''
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{chat.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {chat.participants?.length || 0} participants
                                        </p>
                                    </div>
                                    {chat.lastMessage && (
                                        <span className="text-xs text-gray-400">
                                            {format(new Date(chat.lastMessage.createdAt), 'MMM d')}
                                        </span>
                                    )}
                                </div>
                                {chat.lastMessage && (
                                    <p className="text-sm text-gray-600 mt-1 truncate">
                                        {chat.lastMessage.content}
                                    </p>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {showNewChatDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Create New Chat</h3>
                        <form onSubmit={handleCreateChat}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Chat Title
                                    </label>
                                    <input
                                        type="text"
                                        value={newChatTitle}
                                        onChange={(e) => setNewChatTitle(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                                        placeholder="Enter chat title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Participant IDs
                                    </label>
                                    <input
                                        type="text"
                                        value={participants}
                                        onChange={(e) => setParticipants(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                                        placeholder="Enter participant IDs (comma-separated)"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewChatDialog(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newChatTitle.trim()}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatList; 