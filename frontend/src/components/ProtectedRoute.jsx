// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthed } from "../lib/auth";

export function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const tokenExists = isAuthed();
    setAuthed(tokenExists);
    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Checking authentication...</div>;
  }

  if (!authed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}