import axios from 'axios';

export const getMeals = async ({
    page = 1,
    limit = 10,
}) => {
    const { data } = await axios.get('/api/meals', {
        params: {
            page,
            results: limit
        }
    });
    return data;
};

export const getMealById = async (id) => {
    const { data } = await axios.get(`/api/meals/${id}`);
    return data;
};
