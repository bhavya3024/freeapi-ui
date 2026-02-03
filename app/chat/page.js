'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../src/context/AuthContext';
import { getChats, getAvailableUsers, getOrCreateChat } from '../../src/apis/chat';

export default function ChatPage() {
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUsers, setShowUsers] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchChats();
        }
    }, [isAuthenticated]);

    const fetchChats = async () => {
        try {
            setLoading(true);
            const { data } = await getChats();
            setChats(data || []);
        } catch (err) {
            setError('Failed to load chats');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await getAvailableUsers();
            setUsers(data || []);
            setShowUsers(true);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    const startChat = async (userId) => {
        try {
            const { data } = await getOrCreateChat(userId);
            router.push(`/chat/${data._id}`);
        } catch (err) {
            console.error('Failed to start chat:', err);
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

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">💬 Chats</h1>
                    <p className="text-gray-500">Welcome, {user?.username || 'User'}</p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl font-medium transition-all"
                >
                    + New Chat
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
                    {error}
                </div>
            )}

            {/* User selection modal */}
            {showUsers && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowUsers(false)}>
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4">Start a new chat</h3>
                        {users.length === 0 ? (
                            <p className="text-gray-500">No users available</p>
                        ) : (
                            <div className="space-y-2">
                                {users.map((u) => (
                                    <button
                                        key={u._id}
                                        onClick={() => startChat(u._id)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                                            {u.username?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium">{u.username}</p>
                                            <p className="text-sm text-gray-500">{u.email}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => setShowUsers(false)}
                            className="mt-4 w-full py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Chat list */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {chats.length === 0 ? (
                    <div className="p-8 text-center">
                        <span className="text-6xl mb-4 block">💭</span>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No chats yet</h3>
                        <p className="text-gray-500 mb-4">Start a conversation with someone!</p>
                        <button
                            onClick={fetchUsers}
                            className="text-blue-500 hover:text-blue-600 font-medium"
                        >
                            Find users to chat with →
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {chats.map((chat) => {
                            const otherParticipant = chat.participants?.find(p => p._id !== user?._id);
                            const chatName = chat.isGroupChat ? chat.name : otherParticipant?.username;
                            const lastMessage = chat.lastMessage;
                            
                            return (
                                <Link
                                    key={chat._id}
                                    href={`/chat/${chat._id}`}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${chat.isGroupChat ? 'bg-gradient-to-br from-green-400 to-blue-400' : 'bg-gradient-to-br from-blue-400 to-purple-400'}`}>
                                        {chat.isGroupChat ? '👥' : chatName?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium text-gray-800 truncate">
                                                {chatName || 'Unknown'}
                                            </h3>
                                            {lastMessage?.createdAt && (
                                                <span className="text-xs text-gray-400">
                                                    {new Date(lastMessage.createdAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">
                                            {lastMessage?.content || 'No messages yet'}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
