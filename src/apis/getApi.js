/**
 * Makes a GET request to the specified URL.
 * @param {string} url The URL to send the GET request to.
 * @param {object} [headers={}] Optional headers to include in the request.
 * @returns {Promise<any>} A promise that resolves with the JSON response data.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export async function getApi(url, headers = {}) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers, // Allow overriding default headers
      },
    });

    if (!response.ok) {
      let errorPayload = response.statusText; // Default to status text
      try {
        const clonedResponse = response.clone();
        // Attempt to parse JSON, store if successful
        const jsonData = await clonedResponse.json(); 
        errorPayload = jsonData; // Use JSON if parsing succeeds
      } catch (jsonError) {
        // If JSON parsing fails, we already have the statusText
        // Alternatively, try reading as text if needed, but statusText is often enough
        // try { errorPayload = await response.text(); } catch (e) {} 
      }

      const errorMessage = `HTTP error! status: ${response.status}, message: ${typeof errorPayload === 'string' ? errorPayload : JSON.stringify(errorPayload)}`;
      throw new Error(errorMessage);
    }

    // Clone response for potential future reads in successful cases
    const responseForJson = response.clone();
    const contentType = responseForJson.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return await responseForJson.json(); // Use the cloned response for reading body
    } else {
        // Handle cases where response is not JSON (e.g., 204 No Content)
        return null; // Or potentially response.text() if needed
    }
  } catch (error) {
    console.error('Fetch GET Error:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
} 