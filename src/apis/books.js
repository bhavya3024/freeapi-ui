import axios from 'axios';

const BASE_URL = 'https://api.freeapi.app/api/v1/public/books';


export const getBooks = async ({
    page = 1,
    results = 10,
}) => {
    const { data: { data } } =  await axios.get(BASE_URL, {
        params: {
            page,
            results
        }
    });
    return data;
}