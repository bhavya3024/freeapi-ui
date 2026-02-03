import axios from 'axios';

export const getJokes = async ({
    page = 1,
    results = 10,
}) => {
    const { data: { data } } = await axios.get('/api/jokes', {
        params: {
            page,
            results
        }
    });
    return data;
}

export const getJokeById = async (id) => {
    const { data } = await axios.get(`/api/jokes/${id}`);
    return data;
};