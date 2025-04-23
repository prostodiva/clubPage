import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';

const Chat = ({ selectedChatId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chatInfo, setChatInfo] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (selectedChatId) {
            fetchChatInfo();
            fetchMessages();
        }
    }, [selectedChatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchChatInfo = async () => {
        try {
            const response = await chatService.getChatById(selectedChatId, user.token);
            setChatInfo(response.data);
        } catch (err) {
            setError('Failed to load chat information');
        }
    };

    const fetchMessages = async () => {
        if (!selectedChatId) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await chatService.getMessages(selectedChatId, user.token);
            setMessages(response.data);
        } catch (err) {
            setError('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const messageData = {
                content: newMessage.trim(),
                senderId: user.id
            };
            
            const response = await chatService.sendMessage(
                selectedChatId,
                messageData,
                user.token
            );
            
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (err) {
            setError('Failed to send message');
        }
    };

    if (!selectedChatId) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="bg-white border-b p-4 shadow-sm">
                <h2 className="text-xl font-semibold">
                    {chatInfo?.title || 'Chat'}
                </h2>
                <p className="text-sm text-gray-500">
                    {chatInfo?.participants?.length || 0} participants
                </p>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
                
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`flex ${
                            message.senderId === user.id ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                                message.senderId === user.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100'
                            }`}
                        >
                            <div className="flex items-baseline mb-1">
                                <span className="font-medium text-sm">
                                    {message.senderId === user.id ? 'You' : message.senderName}
                                </span>
                                <span className="ml-2 text-xs opacity-75">
                                    {format(new Date(message.createdAt), 'HH:mm')}
                                </span>
                            </div>
                            <p className="break-words">{message.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat; 