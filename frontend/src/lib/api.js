// lib/api.js

// 🔹 Deployed backend URL
const BASE_URL = "https://interview-practice-analyzer.onrender.com";

/**
 * Wrapper for fetch requests to backend
 * @param {string} path - API path, e.g., "/api/auth/login"
 * @param {object} options - fetch options (method, body, headers)
 */
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("ipa_token"); // 👈 get token

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // 👈 ADD THIS
      ...(options.headers || {}),
    },
    body: options.body ? options.body : undefined,
  });

  if (!res.ok) {
    let errData = {};
    try {
      errData = await res.json();
    } catch (e) {}

    throw new Error(errData.error || res.statusText || "API error");
  }

  return res.json();
}