import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";

function percent(n) {
  return `${Math.round(n * 100)}%`;
}

export function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [problems, setProblems] = useState(null);
  const [error, setError] = useState("");

  const recent = useMemo(() => (problems?.problems || []).slice(0, 8), [problems]);

  useEffect(() => {
    let alive = true;
    async function load() {
      setError("");
      try {
        const [d, a, r, p] = await Promise.all([
          apiFetch("/api/analytics/dashboard"),
          apiFetch("/api/analytics"),
          apiFetch("/api/analytics/recommendations"),
          apiFetch("/api/problems"),
        ]);
        if (!alive) return;
        setDashboard(d);
        setAnalytics(a);
        setRecommendations(r);
        setProblems(p);
      } catch (err) {
        if (!alive) return;
        setError(err.message || "Failed to load dashboard");
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, []);

  if (error) {
    return (
      <div className="card">
        <div className="title">Dashboard</div>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!dashboard || !analytics || !recommendations || !problems) {
    return (
      <div className="card">
        <div className="title">Dashboard</div>
        <div className="muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="grid cols-3">
        <div className="card">
          <div className="muted">Total problems</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{dashboard.totalProblems}</div>
        </div>
        <div className="card">
          <div className="muted">Solved</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{dashboard.solvedProblems}</div>
        </div>
        <div className="card">
          <div className="muted">Overall accuracy</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{percent(analytics.overallAccuracy || 0)}</div>
        </div>
      </div>

      <div className="grid cols-3">
        <div className="card">
          <div className="title" style={{ fontSize: 18 }}>
            Weakest topic
          </div>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>{analytics.weakestTopic || "—"}</div>
          <div className="muted">{analytics.weakestTopicReason || "Add more problems to compute this."}</div>
        </div>
        <div className="card">
          <div className="title" style={{ fontSize: 18 }}>
            Avg time by difficulty (solved)
          </div>
          <div className="muted">
            EASY: {analytics.averageTimeByDifficulty.EASY ?? "—"} min
            <br />
            MEDIUM: {analytics.averageTimeByDifficulty.MEDIUM ?? "—"} min
            <br />
            HARD: {analytics.averageTimeByDifficulty.HARD ?? "—"} min
          </div>
        </div>
        <div className="card">
          <div className="title" style={{ fontSize: 18 }}>
            Next topics
          </div>
          <div className="row" style={{ gap: 8 }}>
            {recommendations.recommendations.map((rec) => (
              <div key={rec.topic}>
                <div style={{ fontWeight: 800 }}>{rec.topic}</div>
                <div className="muted">{rec.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid cols-3">
        <div className="card" style={{ gridColumn: "span 2" }}>
          <div className="title" style={{ fontSize: 18 }}>
            Topic breakdown
          </div>
          {dashboard.byTopic.length === 0 ? (
            <div className="muted">
              No data yet. <Link to="/add">Add your first problem</Link>.
            </div>
          ) : (
            <div className="row" style={{ gap: 8 }}>
              {dashboard.byTopic.slice(0, 10).map((t) => (
                <div key={t.topic} style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>{t.topic}</div>
                  <div className="muted">{t.count}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <div className="title" style={{ fontSize: 18 }}>
            Suggestions
          </div>
          <div className="row" style={{ gap: 10 }}>
            {analytics.suggestions.map((s) => (
              <div key={s.title}>
                <div style={{ fontWeight: 800 }}>{s.title}</div>
                <div className="muted">{s.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="title" style={{ fontSize: 18 }}>
          Recent entries
        </div>
        {recent.length === 0 ? (
          <div className="muted">
            Nothing here yet. <Link to="/add">Add a problem</Link>.
          </div>
        ) : (
          <div className="row" style={{ gap: 8 }}>
            {recent.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 0.8fr 0.8fr 0.8fr",
                  gap: 10,
                  paddingBottom: 8,
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div style={{ fontWeight: 700 }}>{p.title}</div>
                <div className="muted">{p.topic}</div>
                <div className="muted">{p.difficulty}</div>
                <div className="muted">
                  {p.status} · {p.timeTaken}m
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

