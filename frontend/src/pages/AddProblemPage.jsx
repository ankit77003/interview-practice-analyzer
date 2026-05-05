import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
const STATUSES = ["SOLVED", "UNSOLVED"];
const PLATFORMS = ["LEETCODE", "GFG", "HACKERRANK", "CODECHEFS"];

const DIFFICULTY_META = {
  EASY:   { color: "#065f46", bg: "#d1fae5", icon: "🟢" },
  MEDIUM: { color: "#92400e", bg: "#fef3c7", icon: "🟡" },
  HARD:   { color: "#991b1b", bg: "#fee2e2", icon: "🔴" },
};

const STATUS_META = {
  SOLVED:   { icon: "✅" },
  UNSOLVED: { icon: "❌" },
};

const PLATFORM_META = {
  LEETCODE:   { icon: "🟠" },
  GFG:        { icon: "🟩" },
  HACKERRANK: { icon: "🟦" },
  CODECHEFS:  { icon: "⭐" },
};

export function AddProblemPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    platform: "LEETCODE",
    difficulty: "EASY",
    topic: "Arrays",
    time_taken: 0,
    status: "SOLVED",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await apiFetch("/api/problems", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          time_taken: Number(form.time_taken || 0),
        }),
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to save problem");
    } finally {
      setBusy(false);
    }
  }

  const diffMeta = DIFFICULTY_META[form.difficulty];

  return (
    <div className="add-problem-container">
      {/* Page Header */}
      <div className="dashboard-header">
        <h1>➕ Add Problem</h1>
        <button
          className="btn-add"
          onClick={() => navigate("/dashboard")}
          type="button"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="add-problem-layout">
        {/* Form Card */}
        <div className="dashboard-card add-form-card">
          <h2 className="card-title">📝 Problem Details</h2>

          <form onSubmit={onSubmit}>
            {/* Title */}
            <div className="add-field">
              <label className="add-label">Problem Title</label>
              <input
                className="add-input"
                placeholder="e.g. Two Sum, Binary Search..."
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
              />
            </div>

            {/* Row 1: Platform · Difficulty · Status */}
            <div className="add-row-3">
              <div className="add-field">
                <label className="add-label">Platform</label>
                <div className="add-select-wrapper">
                  <span className="add-select-prefix">
                    {PLATFORM_META[form.platform]?.icon}
                  </span>
                  <select
                    className="add-select"
                    value={form.platform}
                    onChange={(e) => set("platform", e.target.value)}
                    required
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="add-field">
                <label className="add-label">Difficulty</label>
                <div className="add-select-wrapper">
                  <span className="add-select-prefix">
                    {DIFFICULTY_META[form.difficulty]?.icon}
                  </span>
                  <select
                    className="add-select"
                    value={form.difficulty}
                    onChange={(e) => set("difficulty", e.target.value)}
                    required
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="add-field">
                <label className="add-label">Status</label>
                <div className="add-select-wrapper">
                  <span className="add-select-prefix">
                    {STATUS_META[form.status]?.icon}
                  </span>
                  <select
                    className="add-select"
                    value={form.status}
                    onChange={(e) => set("status", e.target.value)}
                    required
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 2: Topic · Time Taken */}
            <div className="add-row-2">
              <div className="add-field">
                <label className="add-label">Topic</label>
                <input
                  className="add-input"
                  placeholder="e.g. Arrays, Trees, DP..."
                  value={form.topic}
                  onChange={(e) => set("topic", e.target.value)}
                  required
                />
              </div>

              <div className="add-field">
                <label className="add-label">⏱️ Time Taken (minutes)</label>
                <input
                  className="add-input"
                  type="number"
                  min="0"
                  value={form.time_taken}
                  onChange={(e) => set("time_taken", e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className="add-error">{error}</div>}

            <button
              className="add-submit-btn"
              disabled={busy}
              type="submit"
            >
              {busy ? "⏳ Saving..." : "✅ Save Problem"}
            </button>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="dashboard-card add-preview-card">
          <h2 className="card-title">👁️ Preview</h2>
          <p className="add-preview-label">How it'll appear in your list</p>

          <div className="problem-item" style={{ cursor: "default" }}>
            <div className="problem-header-row">
              <div className="problem-title">
                {form.title || "Your problem title"}
              </div>
              <span className={`status-badge ${form.status.toLowerCase()}`}>
                {STATUS_META[form.status]?.icon}
              </span>
            </div>

            <div className="problem-meta">
              <span className="badge">{form.topic || "Topic"}</span>
              <span className={`badge difficulty-${form.difficulty.toLowerCase()}`}>
                {form.difficulty}
              </span>
              <span className="badge">{form.platform}</span>
            </div>

            {Number(form.time_taken) > 0 && (
              <div className="problem-time">⏱️ {form.time_taken} min</div>
            )}
          </div>

          {/* Difficulty callout */}
          <div
            className="add-difficulty-callout"
            style={{
              background: diffMeta.bg,
              borderLeftColor: diffMeta.color,
              color: diffMeta.color,
            }}
          >
            <span style={{ fontSize: 20 }}>{diffMeta.icon}</span>
            <span>
              <strong>{form.difficulty}</strong> difficulty selected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
