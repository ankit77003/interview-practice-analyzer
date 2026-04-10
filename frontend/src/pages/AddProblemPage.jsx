import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
const STATUSES = ["SOLVED", "UNSOLVED"];
const PLATFORMS = ["LEETCODE", "GFG", "HACKERRANK", "CODECHEFS"];

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

  return (
    <div className="card" style={{ maxWidth: 720 }}>
      <div className="title">Add problem</div>
      <form onSubmit={onSubmit} className="row">
        <div className="field">
          <label>Title</label>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
        </div>

        <div className="grid cols-3">
          <div className="field">
            <label>Platform</label>
            <select
              value={form.platform}
              onChange={(e) => set("platform", e.target.value)}
              required
            >
              {PLATFORMS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => set("difficulty", e.target.value)}
              required
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              required
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid cols-3">
          <div className="field">
            <label>Topic</label>
            <input
              value={form.topic}
              onChange={(e) => set("topic", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Time taken (minutes)</label>
            <input
              value={form.time_taken}
              onChange={(e) => set("time_taken", e.target.value)}
              type="number"
              min="0"
              required
            />
          </div>
          <div className="field">
            <label>&nbsp;</label>
            <button
              className="btn primary "
              id="save-btn"
              disabled={busy}
              type="submit"
            >
              {busy ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
