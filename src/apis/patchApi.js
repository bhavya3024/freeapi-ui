/**
 * Makes a PATCH request to the specified URL.
 * @param {string} url The URL to send the PATCH request to.
 * @param {object} body The data to send in the request body.
 * @param {object} [headers={}] Optional headers to include in the request.
 * @returns {Promise<any>} A promise that resolves with the JSON response data.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export async function patchApi(url, body, headers = {}) {
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
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

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
    } else {
        return null;
    }
  } catch (error) {
    console.error('Fetch PATCH Error:', error);
    throw error;
  }
} 