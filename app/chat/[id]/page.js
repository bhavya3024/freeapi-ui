'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../src/context/AuthContext';
import { getChatById, getMessages, sendMessage } from '../../../src/apis/chat';

export default function ChatDetailPage() {
    const { id } = useParams();
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated && id) {
            fetchChatData();
        }
    }, [isAuthenticated, id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchChatData = async () => {
        try {
            setLoading(true);
            const [chatRes, messagesRes] = await Promise.all([
                getChatById(id),
                getMessages(id),
            ]);
            setChat(chatRes.data);
            setMessages(messagesRes.data || []);
        } catch (err) {
            setError('Failed to load chat');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        try {
            setSending(true);
            const { data } = await sendMessage(id, newMessage.trim());
            setMessages((prev) => [...prev, data]);
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setSending(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const otherParticipant = chat?.participants?.find(p => p._id !== user?._id);
    const chatName = chat?.isGroupChat ? chat.name : otherParticipant?.username;

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-t-2xl shadow-lg p-4 flex items-center gap-4">
                <Link href="/chat" className="text-gray-500 hover:text-gray-700">
                    ←
                </Link>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${chat?.isGroupChat ? 'bg-gradient-to-br from-green-400 to-blue-400' : 'bg-gradient-to-br from-blue-400 to-purple-400'}`}>
                    {chat?.isGroupChat ? '👥' : chatName?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                    <h2 className="font-semibold text-gray-800">{chatName || 'Chat'}</h2>
                    {chat?.isGroupChat && (
                        <p className="text-xs text-gray-500">
                            {chat.participants?.length} participants
                        </p>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <span className="text-4xl mb-2 block">👋</span>
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwn = message.sender?._id === user?._id;
                        return (
                            <div
                                key={message._id}
                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                                    {!isOwn && (
                                        <p className="text-xs text-gray-500 mb-1 ml-2">
                                            {message.sender?.username}
                                        </p>
                                    )}
                                    <div
                                        className={`px-4 py-2 rounded-2xl ${
                                            isOwn
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md'
                                                : 'bg-white shadow-sm rounded-bl-md'
                                        }`}
                                    >
                                        <p className="text-sm">{message.content}</p>
                                        {message.attachments?.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {message.attachments.map((att, i) => (
                                                    <a
                                                        key={i}
                                                        href={att.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs underline"
                                                    >
                                                        📎 Attachment {i + 1}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <p className={`text-xs text-gray-400 mt-1 ${isOwn ? 'text-right mr-2' : 'ml-2'}`}>
                                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="bg-white rounded-b-2xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
