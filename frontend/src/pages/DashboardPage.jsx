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
  const [loading, setLoading] = useState(true);

  const recent = useMemo(
    () => (problems?.problems || []).slice(0, 8),
    [problems]
  );

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [d, a, r, p] = await Promise.all([
          apiFetch("/api/analytics/dashboard"),
          apiFetch("/api/analytics"),
          apiFetch("/api/analytics/recommendations"),
          apiFetch("/api/problems"),
        ]);

        if (!alive) return;

        setDashboard(d || { totalProblems: 0, solvedProblems: 0, byTopic: [] });
        setAnalytics(a || {
          overallAccuracy: 0,
          weakestTopic: null,
          weakestTopicReason: "",
          averageTimeByDifficulty: {},
          suggestions: [],
        });
        setRecommendations(r || { recommendations: [] });
        setProblems(p || { problems: [] });

      } catch (err) {
        if (!alive) return;
        setError(err.message || "Failed to load dashboard");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h3>⏳ Loading dashboard...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h3 style={{ color: "red" }}>❌ Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!dashboard || !analytics || !recommendations || !problems) {
    return <div style={{ padding: 20 }}>No data available</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>📊 Your Dashboard</h1>
        <Link to="/add" className="btn-add">+ Add Problem</Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <div className="stat-label">Total Problems</div>
            <div className="stat-value">{dashboard.totalProblems}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-label">Solved</div>
            <div className="stat-value">{dashboard.solvedProblems}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <div className="stat-label">Accuracy</div>
            <div className="stat-value">{percent(analytics.overallAccuracy || 0)}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Left Column */}
        <div className="dashboard-left">
          {/* Weakest Topic */}
          <div className="dashboard-card">
            <h2 className="card-title">🔴 Weakest Topic</h2>
            {analytics.weakestTopic ? (
              <div className="topic-content">
                <div className="topic-name-large">{analytics.weakestTopic}</div>
                <div className="topic-reason">{analytics.weakestTopicReason}</div>
              </div>
            ) : (
              <p className="empty-state">Keep solving more problems to identify weak areas! 💪</p>
            )}
          </div>

          {/* Suggestions */}
          <div className="dashboard-card">
            <h2 className="card-title">💡 Improvement Tips</h2>
            {analytics.suggestions && analytics.suggestions.length > 0 ? (
              <div className="suggestions-stack">
                {analytics.suggestions.map((s, i) => (
                  <div key={i} className="suggestion-box">
                    <div className="suggestion-title">{s.title}</div>
                    <div className="suggestion-text">{s.detail}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">Suggestions will appear as you practice more.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          {/* Topics Progress */}
          <div className="dashboard-card">
            <h2 className="card-title">📚 Topics Progress</h2>
            {dashboard.byTopic && dashboard.byTopic.length > 0 ? (
              <div className="topics-stack">
                {dashboard.byTopic.map((t) => (
                  <div key={t.topic} className="topic-row">
                    <div className="topic-row-info">
                      <span className="topic-row-name">{t.topic}</span>
                      <span className="topic-row-count">{t.count} problems</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${Math.min((t.count / Math.max(...dashboard.byTopic.map(x => x.count), 1)) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No topics yet. Start adding problems!</p>
            )}
          </div>

          {/* Recommendations */}
          <div className="dashboard-card">
            <h2 className="card-title">🎯 Focus Areas</h2>
            {recommendations.recommendations && recommendations.recommendations.length > 0 ? (
              <div className="recommendations-stack">
                {recommendations.recommendations.map((rec) => (
                  <div key={rec.topic} className="recommendation-box">
                    <div className="rec-topic">{rec.topic}</div>
                    <div className="rec-reason">{rec.reason}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">Recommendations coming soon.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Problems */}
      <div className="dashboard-card full-width">
        <h2 className="card-title">📋 Recent Problems</h2>
        {recent.length > 0 ? (
          <div className="problems-grid">
            {recent.map((p) => (
              <div key={p.id} className="problem-item">
                <div className="problem-header-row">
                  <div className="problem-title">{p.title}</div>
                  <span className={`status-badge ${p.status.toLowerCase()}`}>
                    {p.status === "SOLVED" ? "✅" : "❌"}
                  </span>
                </div>
                <div className="problem-meta">
                  <span className="badge">{p.topic}</span>
                  <span className={`badge difficulty-${p.difficulty.toLowerCase()}`}>
                    {p.difficulty}
                  </span>
                  <span className="badge">{p.platform}</span>
                </div>
                {p.timeTaken > 0 && (
                  <div className="problem-time">⏱️ {p.timeTaken} min</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No problems added yet.</p>
            <Link to="/add">Add your first problem →</Link>
          </div>
        )}
      </div>
    </div>
  );
}