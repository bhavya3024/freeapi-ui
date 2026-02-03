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
