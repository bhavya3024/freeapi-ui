import axios from 'axios';

export const getDogs = async ({
    page = 1,
    limit = 10,
}) => {
    const { data } = await axios.get('/api/dogs', {
        params: {
            page,
            results: limit
        }
    });
    return data;
};

export const getDogById = async (id) => {
    const { data } = await axios.get(`/api/dogs/${id}`);
    return data;
};
