import axios from 'axios';

export const getCats = async ({
    page = 1,
    limit = 10,
}) => {
    const { data: { data: cats } } = await axios.get('/api/cats', {
        params: {
            page,
            results: limit,
        }
    });
    return cats;
};

export const getRandomCat = async () => {
    const { data: { data } } = await axios.get('/api/cats/random');
    return data;
};

export const getCatById = async (id) => {
    const { data } = await axios.get(`/api/cats/${id}`);
    return data;
};
