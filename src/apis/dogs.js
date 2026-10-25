import axios from 'axios';

export const getDogs = async ({
    page = 1,
    limit = 10,
}) => {
    const { data: { data: dogs } } = await axios.get('/api/dogs', {
        params: {
            page,
            results: limit
        }
    });
    return dogs;
};

export const getRandomDog = async () => {
    const { data: { data } } = await axios.get('/api/dogs/random');
    return data;
};

export const getDogById = async (id) => {
    const { data } = await axios.get(`/api/dogs/${id}`);
    return data;
};
