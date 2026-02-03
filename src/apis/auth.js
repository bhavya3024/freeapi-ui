import axios from 'axios';

// Create axios instance pointing to local API routes
const authApi = axios.create({
    baseURL: '/api/auth',
});

// Add token to requests
authApi.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const register = async ({ email, username, password, role = 'USER' }) => {
    const { data } = await authApi.post('/register', {
        email,
        username,
        password,
        role,
    });
    return data;
};

export const login = async ({ email, username, password }) => {
    const { data } = await authApi.post('/login', {
        email,
        username,
        password,
    });
    // Store tokens
    if (data.data?.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
    }
    if (data.data?.refreshToken) {
        localStorage.setItem('refreshToken', data.data.refreshToken);
    }
    return data;
};

export const logout = async () => {
    const { data } = await authApi.post('/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return data;
};

export const getCurrentUser = async () => {
    const { data } = await authApi.get('/current-user');
    return data;
};

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const { data } = await authApi.post('/refresh-token', {
        refreshToken,
    });
    if (data.data?.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
    }
    return data;
};
