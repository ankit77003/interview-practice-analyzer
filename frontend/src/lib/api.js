// API base URL configuration
const API_BASE_URL = 'https://api.example.com';

// Better error handling
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch operation failed:', error);
        throw error;
    }
}

export { fetchData };