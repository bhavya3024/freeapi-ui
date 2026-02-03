import axios from 'axios';

export const getCats = async ({
    page = 1,
    limit = 10,
}) => {
    const { data } = await axios.get('/api/cats', {
        params: {
            page,
            results: limit,
        }
    });
    return data;
};

export const getCatById = async (id) => {
    const { data } = await axios.get(`/api/cats/${id}`);
    return data;
};
