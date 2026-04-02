import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AddProblemPage } from "./pages/AddProblemPage";
import { isAuthed } from "./lib/auth";
import { ToastContainer } from "react-toastify";
import { OAuthSuccess } from "./pages/OAuthSuccess";


export default function App() {
  return (
    <Layout>
        <ToastContainer
  position="top-center"
  autoClose={3000}
  theme="dark"
/>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthed() ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddProblemPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
