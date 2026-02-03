import axios from 'axios';

export const getStocks = async ({
    page = 1,
    results = 10,
}) => {
    const { data: { data } } = await axios.get('/api/stocks', {
        params: {
            page,
            results
        }
    });
    return data;
};

export const getStockBySymbol = async (symbol) => {
    const { data } = await axios.get(`/api/stocks/${symbol}`);
    return data;
};
