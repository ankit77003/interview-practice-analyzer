import { Navigate } from "react-router-dom";
import { isAuthed } from "../lib/auth";

export function ProtectedRoute({ children }) {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  return children;
}

