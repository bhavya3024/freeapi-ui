import axios from "axios";

export const getUsers = async ({
    page = 1,
    results = 10,
}) => {
    const { data } = await axios.get('/api/users', {
        params: {
            page,
            results,
        },
    });

    return data;
};

export const getUserById = async (id) => {
    const { data } = await axios.get(`/api/users/${id}`);
    return data;
};

