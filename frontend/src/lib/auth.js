const TOKEN_KEY = "interview_practice_token";

/**
 * Get JWT token from localStorage
 * @returns {string|null} - JWT token or null if not found
 */
export function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    console.log("✅ Token retrieved from localStorage");
  } else {
    console.warn("⚠️ No token found in localStorage");
  }
  return token;
}

/**
 * Save JWT token to localStorage
 * @param {string} token - JWT token to save
 */
export function setToken(token) {
  if (!token) {
    console.warn("⚠️ Attempted to save empty token");
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
  console.log("✅ Token saved to localStorage");
}

/**
 * Clear JWT token from localStorage
 */
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  console.log("✅ Token cleared from localStorage");
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if token exists, false otherwise
 */
export function isAuthed() {
  return Boolean(getToken());
}