import axios from 'axios';

export const getBooks = async ({
    page = 1,
    results = 10,
}) => {
    const { data: { data } } = await axios.get('/api/books', {
        params: {
            page,
            results
        }
    });
    return data;
}

export const getBookById = async (id) => {
    const { data } = await axios.get(`/api/books/${id}`);
    return data;
};