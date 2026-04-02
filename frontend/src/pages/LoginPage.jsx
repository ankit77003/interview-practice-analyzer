// src/pages/LoginPage.js
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { setToken } from "../lib/auth";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const title = useMemo(
    () => (mode === "login" ? "Login" : "Create account"),
    [mode],
  );

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
      console.log("DATA:", data);

      // 🔹 Store JWT token in localStorage so apiFetch can send it automatically
      if (!data.token) {
        toast.error(
          data?.error || data?.message || "Invalid email or password",
        );
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
    <div className="wrapper">
      <div className="outerContainer">
        <div
          className="card"
          style={{ backgroundColor: "#27272A", transform: "none" }}
        >
          <div className="title" style={{ color: "white" }}>
            {title}
          </div>
          <div className="muted" style={{ marginBottom: 14, color: "#fff" }}>
            {mode === "login"
              ? "We Are Happy To See You Again"
              : "Password must be at least 8 characters."}
          </div>

          <form onSubmit={onSubmit} className="row">
            <div className="field input-wrapper">
              <div className="password-wrapper">
                <label style={{ color: "white" }}>Email</label>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="Enter you email"
                />
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="input-icon"
                  id="env-icon"
                />
              </div>
            </div>
            <div className="field input-wrapper">
              <label style={{ color: "white" }}>Password</label>
              <div className="password-wrapper" id="show-password">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
            </div>
            <div className="forgot-password">
              <a href="">Forgot Password</a>
            </div>
            {error && <div className="error">{error}</div>}
            <button className="btn primary" disabled={busy} type="submit">
              {busy ? "Please wait..." : title}
            </button>
          </form>

          <div className="muted" style={{ marginTop: 12 }}>
            {mode === "login" ? (
              <button
                className="btn"
                onClick={() => setMode("signup")}
                type="button"
              >
                Need an account? Sign up
              </button>
            ) : (
              <button
                className="btn"
                onClick={() => setMode("login")}
                type="button"
              >
                Have an account? Login
              </button>
            )}
          </div>
          <div className="or-divider">OR</div>
          <div className="login-box">
            <div className="login-other" id="login-1"
            onClick={()=>{
               window.location.href = "http://localhost:5000/api/auth/apple";
            }}
            >
              <span id="apple-logo">
                <FontAwesomeIcon icon={faApple} className="input-icon" />
              </span>
              <span>Log in with Apple</span>
            </div>
          </div>
          <div className="login-box">
            <div className="login-other" id="login-2"
            onClick={()=>{
               window.location.href = "http://localhost:5000/api/auth/google";
            }}
            >
              <span id="a">G</span>
              <span>Log in with Google</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
