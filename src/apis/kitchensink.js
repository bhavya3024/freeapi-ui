import axios from 'axios';

// Basic HTTP Methods
export const testGetRequest = async () => {
    const { data } = await axios.get('/api/kitchen-sink/get');
    return data;
};

export const testPostRequest = async (payload) => {
    const { data } = await axios.post('/api/kitchen-sink/post', payload);
    return data;
};

export const testPutRequest = async (payload) => {
    const { data } = await axios.put('/api/kitchen-sink/put', payload);
    return data;
};

export const testPatchRequest = async (payload) => {
    const { data } = await axios.patch('/api/kitchen-sink/patch', payload);
    return data;
};

export const testDeleteRequest = async () => {
    const { data } = await axios.delete('/api/kitchen-sink/delete');
    return data;
};

// Status Codes
export const getAllStatusCodes = async () => {
    const { data } = await axios.get('/api/kitchen-sink/status-codes');
    return data;
};

export const getStatusCode = async (code) => {
    const { data } = await axios.get(`/api/kitchen-sink/status/${code}`);
    return data;
};

// Headers and Request Info
export const getRequestHeaders = async () => {
    const { data } = await axios.get('/api/kitchen-sink/request-headers');
    return data;
};

export const getClientIP = async () => {
    const { data } = await axios.get('/api/kitchen-sink/client-ip');
    return data;
};

export const getUserAgent = async () => {
    const { data } = await axios.get('/api/kitchen-sink/user-agent');
    return data;
};

export const getPathVariable = async (variable) => {
    const { data } = await axios.get(`/api/kitchen-sink/path/${variable}`);
    return data;
};

export const getQueryParameters = async (params) => {
    const { data } = await axios.get('/api/kitchen-sink/query', { params });
    return data;
};

export const getResponseHeaders = async () => {
    const { data } = await axios.get('/api/kitchen-sink/response-headers');
    return data;
};

// Response Types
export const sendHtmlResponse = async () => {
    const { data } = await axios.get('/api/kitchen-sink/html');
    return data;
};

export const sendXmlResponse = async () => {
    const { data } = await axios.get('/api/kitchen-sink/xml');
    return data;
};

// Cookies
export const getCookies = async () => {
    const { data } = await axios.get('/api/kitchen-sink/cookies');
    return data;
};

export const setCookie = async (cookieData) => {
    const { data } = await axios.post('/api/kitchen-sink/cookies', cookieData);
    return data;
};

export const removeCookie = async (cookieName) => {
    const { data } = await axios.delete(`/api/kitchen-sink/cookies/${cookieName}`);
    return data;
};

// Cache
export const setCacheControlHeader = async () => {
    const { data } = await axios.get('/api/kitchen-sink/cache');
    return data;
};

// Compression
export const getGzipResponse = async () => {
    const { data } = await axios.get('/api/kitchen-sink/gzip');
    return data;
};

export const getBrotliResponse = async () => {
    const { data } = await axios.get('/api/kitchen-sink/brotli');
    return data;
};
