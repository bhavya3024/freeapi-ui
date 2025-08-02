import axios from 'axios';

const BASE_URL = 'https://api.freeapi.app/api/v1/public/youtube/videos';

export const getVideos = async ({
    page = 1,
    limit = 10,
}) => {
    const { data } = await axios.get(BASE_URL, {
        params: {
            page,
            results: limit
        }
    });
    return data;
};
