import axios from 'axios';

export const getVideos = async ({
    page = 1,
    limit = 10,
}) => {
    const { data } = await axios.get('/api/videos', {
        params: {
            page,
            results: limit
        }
    });
    return data;
};

export const getVideoById = async (id) => {
    const { data } = await axios.get(`/api/videos/${id}`);
    return data;
};

export const getRandomVideo = async () => {
    const { data: { data } } = await axios.get('/api/videos/random');
    return data;
};

export const getChannelDetails = async () => {
    const { data } = await axios.get('/api/videos/channel');
    return data;
};

export const getVideoComments = async (id) => {
    const { data } = await axios.get(`/api/videos/${id}/comments`);
    return data;
};

export const getRelatedVideos = async (id) => {
    const { data } = await axios.get(`/api/videos/${id}/related`);
    return data;
};

export const getPlaylists = async () => {
    const { data } = await axios.get('/api/videos/playlists');
    return data;
};

export const getPlaylistDetails = async (playlistId) => {
    const { data } = await axios.get(`/api/videos/playlists/${playlistId}`);
    return data;
};
