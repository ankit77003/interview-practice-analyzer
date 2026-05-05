// src/pages/LoginPage.js
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { setToken } from "../lib/auth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEyeSlash,
  faEye,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { faApple } from "@fortawesome/free-brands-svg-icons";

export function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setToken(token);
      window.history.replaceState({}, document.title, "/login");
      navigate("/dashboard");
    }
  }, [navigate]);

  const title = useMemo(
    () => (mode === "login" ? "Welcome back" : "Create account"),
    [mode]
  );

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const path = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const data = await apiFetch(path, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      console.log("LOGIN RESPONSE:", data);
      if (!data.token) {
        toast.error(data?.error || data?.message || "Invalid email or password");
        return;
      }
      setToken(data.token);
      navigate("/dashboard");
    } catch (err) {
      console.log("ERROR:", err);
      toast.error(err?.message || err?.error || "Invalid email or password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">📊</div>
          <h1 className="login-title">{title}</h1>
          <p className="login-subtitle">
            {mode === "login"
              ? "Good to see you again. Let's pick up where you left off."
              : "Password must be at least 8 characters."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="login-form">
          {/* Email */}
          <div className="login-field">
            <label className="login-label">Email</label>
            <div className="login-input-wrapper">
              <FontAwesomeIcon icon={faEnvelope} className="login-input-icon" />
              <input
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <div className="login-label-row">
              <label className="login-label">Password</label>
              <a href="" className="login-forgot">Forgot password?</a>
            </div>
            <div className="login-input-wrapper">
              <FontAwesomeIcon icon={faLock} className="login-input-icon" />
              <input
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
              />
              <span
                className="login-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          {error && <div className="add-error">{error}</div>}

          <button className="add-submit-btn" disabled={busy} type="submit">
            {busy ? "⏳ Please wait..." : mode === "login" ? "🔐 Login" : "🚀 Create Account"}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="login-toggle">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button className="login-toggle-btn" onClick={() => setMode("signup")} type="button">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="login-toggle-btn" onClick={() => setMode("login")} type="button">
                Login
              </button>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="login-divider">
          <span>or continue with</span>
        </div>

        {/* OAuth buttons */}
        <div className="login-oauth">
          {/* Google */}
          <button
            className="login-oauth-btn"
            type="button"
            onClick={() => { window.location.href = "http://localhost:4000/api/auth/google"; }}
          >
            <span className="google-g">G</span>
            <span>Google</span>
          </button>

          {/* Apple */}
          <button
            className="login-oauth-btn login-oauth-apple"
            type="button"
            onClick={() => { window.location.href = "http://localhost:4000/api/auth/apple"; }}
          >
            <FontAwesomeIcon icon={faApple} style={{ fontSize: 18 }} />
            <span>Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
}
