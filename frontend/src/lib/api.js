// src/lib/api.js
import { getToken, clearToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const logApiCall = (url) => {
  console.log(`API call to: ${url}`);
};

const handle401Error = async (response) => {
  if (response.status === 401) {
    console.warn("401 Unauthorized detected");
    clearToken();
    window.location.href = "/login";
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

  const response = await fetch(url, { ...options, headers });

  handle401Error(response);

  const text = await response.text();

  // Try parsing JSON, fallback to error if not JSON
  try {
    const data = JSON.parse(text);
    if (!response.ok) {
      throw new Error(data.message || data.error || "API error");
    }
    return data;
  } catch (err) {
    // If HTML comes instead of JSON
    if (text.startsWith("<!doctype") || text.startsWith("<html")) {
      throw new Error("Server returned HTML instead of JSON. Possibly unauthorized or API endpoint not found.");
    }
    throw err;
  }
};