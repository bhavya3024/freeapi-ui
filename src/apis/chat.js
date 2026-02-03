import axios from 'axios';

// Create axios instance pointing to local API routes
const chatApi = axios.create({
    baseURL: '/api/chat',
});

// Add token to requests
chatApi.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Get all chats for current user
export const getChats = async () => {
    const { data } = await chatApi.get('/chats');
    return data;
};

// Get or create one-on-one chat
export const getOrCreateChat = async (receiverId) => {
    const { data } = await chatApi.post(`/chats/c/${receiverId}`);
    return data;
};

// Create group chat
export const createGroupChat = async ({ name, participants }) => {
    const { data } = await chatApi.post('/chats/group', {
        name,
        participants,
    });
    return data;
};

// Get chat details
export const getChatById = async (chatId) => {
    const { data } = await chatApi.get(`/chats/${chatId}`);
    return data;
};

// Delete chat
export const deleteChat = async (chatId) => {
    const { data } = await chatApi.delete(`/chats/${chatId}`);
    return data;
};

// Get messages for a chat
export const getMessages = async (chatId) => {
    const { data } = await chatApi.get(`/messages/${chatId}`);
    return data;
};

// Send message
export const sendMessage = async (chatId, content, attachments = []) => {
    const formData = new FormData();
    formData.append('content', content);
    attachments.forEach((file) => {
        formData.append('attachments', file);
    });
    
    const { data } = await chatApi.post(`/messages/${chatId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

// Delete message
export const deleteMessage = async (chatId, messageId) => {
    const { data } = await chatApi.delete(`/messages/${chatId}/${messageId}`);
    return data;
};

// Get available users for chat
export const getAvailableUsers = async () => {
    const { data } = await chatApi.get('/chats/users');
    return data;
};

// Add participant to group
export const addParticipant = async (chatId, participantId) => {
    const { data } = await chatApi.post(`/chats/group/${chatId}/${participantId}`);
    return data;
};

// Remove participant from group
export const removeParticipant = async (chatId, participantId) => {
    const { data } = await chatApi.delete(`/chats/group/${chatId}/${participantId}`);
    return data;
};

// Leave group
export const leaveGroup = async (chatId) => {
    const { data } = await chatApi.delete(`/chats/leave/group/${chatId}`);
    return data;
};
