import { Navigate } from "react-router-dom";
import { isAuthed } from "../lib/auth";

export function ProtectedRoute({ children }) {
    const authed = isAuthed();
    if (!authed) {
        return <Navigate to="/login" replace />;
    }
    return children;
}