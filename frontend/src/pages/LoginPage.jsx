// src/pages/LoginPage.js
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { setToken } from "../lib/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const title = useMemo(() => (mode === "login" ? "Login" : "Create account"), [mode]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const path = mode === "login" ? "/api/auth/login" : "/api/auth/signup";

      // Call backend API
      const data = await apiFetch(path, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // 🔹 Store JWT token in localStorage so apiFetch can send it automatically
      if (data.token) {
        setToken(data.token); // lib/auth.js: must save to localStorage
        console.log("Token saved:", localStorage.getItem("token"));
      } else {
        throw new Error("No token received from server");
      }

      // Navigate to dashboard after successful login/signup
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong");
      console.error("Login/Signup error:", err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520 }}>
      <div className="title">{title}</div>
      <div className="muted" style={{ marginBottom: 14 }}>
        {mode === "login" ? "Use your email + password." : "Password must be at least 8 characters."}
      </div>

      <form onSubmit={onSubmit} className="row">
        <div className="field">
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn primary" disabled={busy} type="submit">
          {busy ? "Please wait..." : title}
        </button>
      </form>

      <div className="muted" style={{ marginTop: 12 }}>
        {mode === "login" ? (
          <button className="btn" onClick={() => setMode("signup")} type="button">
            Need an account? Sign up
          </button>
        ) : (
          <button className="btn" onClick={() => setMode("login")} type="button">
            Have an account? Login
          </button>
        )}
      </div>
    </div>
  );
}