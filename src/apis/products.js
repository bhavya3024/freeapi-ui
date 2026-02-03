import axios from 'axios';

export const getProducts = async ({
    page = 1,
    results = 10,
}) => {
    const { data: { data } } = await axios.get('/api/products', {
        params: {
            page,
            results
        }
    });
    return data;
}

export const getProductById = async (id) => {
    const { data } = await axios.get(`/api/products/${id}`);
    return data;
};