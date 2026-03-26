import { getToken, clearToken } from './auth';

// Log API calls
const logApiCall = (url) => {
    console.log(`API call to: ${url}`);
};

// Validate token
const isAuthenticated = () => {
    const token = getToken();
    return token != null;
};

const handle401Error = (response) => {
    if (response.status === 401) {
        clearToken();
        window.location = '/login';
    }
};

const improvedErrorMessages = (error) => {
    return `Error: ${error.message || 'Something went wrong.'}`;
};

export const apiFetch = async (url, options = {}) => {
    logApiCall(url);

    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    handle401Error(response);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "API request failed");
    }

    return response.json();
};

export { logApiCall, isAuthenticated, handle401Error, improvedErrorMessages };