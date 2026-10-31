// OAuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../lib/auth";

export function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");


    if (token) {
      // Save token to localStorage
      setToken(token);

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return <div>Logging in...</div>;
}