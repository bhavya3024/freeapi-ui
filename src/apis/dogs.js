import axios from 'axios';

const BASE_URL = 'https://api.freeapi.app/api/v1/public/dogs';

export const getDogs = async ({
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
