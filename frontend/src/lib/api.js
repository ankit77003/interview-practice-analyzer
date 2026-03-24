import { getToken } from "./auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  
  // FIX: Only set content-type if body is a string (not FormData or other types)
  if (!headers.has("content-type") && options.body && typeof options.body === "string") {
    headers.set("content-type", "application/json");
  }
  
  if (token) headers.set("authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const text = await res.text();
  
  // FIX: Better handling of empty responses and JSON parsing
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      throw new Error("Invalid JSON response from server");
    }
  }

  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  
  return data;
}