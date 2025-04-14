/**
 * Makes a DELETE request to the specified URL.
 * @param {string} url The URL to send the DELETE request to.
 * @param {object} [headers={}] Optional headers to include in the request.
 * @returns {Promise<any>} A promise that resolves with the JSON response data (or null if no content).
 * @throws {Error} Throws an error if the network response is not ok.
 */
export async function deleteApi(url, headers = {}) {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (e) {
        errorBody = await response.text();
      }
      throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorBody) || response.statusText}`);
    }

    // DELETE requests might return 204 No Content or a JSON body
    const contentType = response.headers.get("content-type");
    if (response.status === 204) {
        return null; // No content to parse
    } else if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
    } else {
        return null; // Or handle other content types if necessary
    }
  } catch (error) {
    console.error('Fetch DELETE Error:', error);
    throw error;
  }
} 