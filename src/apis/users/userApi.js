import { getApi } from '../getApi';

// Base URL using the Vite proxy, pointing to the correct public endpoint
const BASE_URL = '/api/v1/public/randomusers'; 

// Removed getAllUsers, getUserById, searchUsers, filterUsers as they don't match the new endpoint

/**
 * Fetches a paginated list of random users.
 * @param {number} [page=1] The page number to fetch.
 * @param {number} [limit=10] The maximum number of users per page.
 * @returns {Promise<any>} A promise that resolves with the paginated user list data.
 */
export async function getRandomUsersPaginated(page = 1, limit = 10) {
  // Ensure page and limit are numbers
  const numPage = parseInt(page, 10) || 1;
  const numLimit = parseInt(limit, 10) || 10;
  
  const url = `${BASE_URL}?page=${numPage}&limit=${numLimit}`;
  
  console.log(`Fetching random users from: ${url}`); // Log the URL being fetched via proxy
  return await getApi(url);
} 