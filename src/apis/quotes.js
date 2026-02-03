import axios from 'axios';

export const getQuotes = async ({
    page = 1,
    limit = 10,
}) => {
    const { data } = await axios.get('/api/quotes', {
        params: {
            page,
            results: limit
        }
    });
    return data;
};

export const getQuoteById = async (id) => {
    const { data } = await axios.get(`/api/quotes/${id}`);
    return data;
};
