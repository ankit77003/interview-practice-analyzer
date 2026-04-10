import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";

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

  const token = localStorage.getItem("interview_practice_token");

  // ✅ PROTECT ROUTE
  // if (!token) {
  //   return <Navigate to="/login" />;
  // }

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

        console.log("Dashboard:", d);
        console.log("Analytics:", a);
        console.log("Recommendations:", r);
        console.log("Problems:", p);

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
        console.log("❌ ERROR:", err.message);
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

  // ✅ LOADING UI
  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h3>Loading dashboard...</h3>
      </div>
    );
  }

  // ✅ ERROR UI
  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h3 style={{ color: "red" }}>Error:</h3>
        <p>{error}</p>
      </div>
    );
  }

  // ✅ SAFETY CHECK (IMPORTANT)
  if (!dashboard || !analytics || !recommendations || !problems) {
    return <div style={{ padding: 20 }}>No data available</div>;
  }

  return (
    <div id="dashboard-container" style={{ padding: 20 }}>

      <h2>Dashboard</h2>

      {/* Stats */}
      <div>
        <p><b>Total Problems:</b> {dashboard.totalProblems}</p>
        <p><b>Solved:</b> {dashboard.solvedProblems}</p>
        <p><b>Accuracy:</b> {percent(analytics.overallAccuracy || 0)}</p>
      </div>

      {/* Weakest Topic */}
      <div>
        <h3>Weakest Topic</h3>
        <p>{analytics.weakestTopic || "—"}</p>
        <p>{analytics.weakestTopicReason}</p>
      </div>

      {/* Recommendations */}
      <div>
        <h3>Next Topics</h3>
        {recommendations.recommendations.length === 0 ? (
          <p>No recommendations</p>
        ) : (
          recommendations.recommendations.map((rec) => (
            <div key={rec.topic}>
              <b>{rec.topic}</b> - {rec.reason}
            </div>
          ))
        )}
      </div>

      {/* Recent */}
      <div>
        <h3>Recent Problems</h3>
        {recent.length === 0 ? (
          <p>
            No problems yet. <Link to="/add">Add one</Link>
          </p>
        ) : (
          recent.map((p) => (
            <div key={p.id}>
              {p.title} - {p.topic} - {p.status}
            </div>
          ))
        )}
      </div>

    </div>
  );
}