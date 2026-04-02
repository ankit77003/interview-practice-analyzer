// src/pages/OAuthSuccess.js

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../lib/auth";

export function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setToken(token);   // store JWT
      navigate("/dashboard"); // redirect after login
    } else {
      navigate("/login"); // fallback if failed
    }
  }, []);

  return <div>Logging you in...</div>;
}