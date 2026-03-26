import { getToken, clearToken } from './auth';

const API_BASE_URL = 'https://api.example.com'; // replace later with your real backend

const logApiCall = (url) => {
    console.log(`API call to: ${url}`);
};

const handle401Error = (response) => {
    if (response.status === 401) {
        clearToken();
        window.location = '/login';
    }
};

export const apiFetch = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
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