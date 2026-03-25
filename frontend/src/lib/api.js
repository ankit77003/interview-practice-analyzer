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

export { logApiCall, isAuthenticated, handle401Error, improvedErrorMessages };