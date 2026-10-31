import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import "./AIPlannerPage.css";

export function AIPlannerPage() {
  const [analytics, setAnalytics] = useState(null);
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plannerTasks, setPlannerTasks] = useState([]);
  const [updatingTask, setUpdatingTask] = useState(null);

  useEffect(() => {
    let alive = true;

    async function loadPlanner() {
      try {
        setLoading(true);
        setError("");

        const [analyticsData, strategyData, tasksData] = await Promise.all([
          apiFetch("/api/analytics"),
          apiFetch("/api/analytics/strategy"),
          apiFetch("/api/analytics/planner-tasks"),
        ]);

        if (!alive) return;

        setAnalytics(analyticsData);
        setStrategy(strategyData?.strategy || null);
        setPlannerTasks(tasksData?.tasks || []);
      } catch (err) {
        if (alive) {
          setError(err.message || "Unable to load your planner");
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadPlanner();

    return () => {
      alive = false;
    };
  }, []);
  async function handleTaskToggle(taskId, completed) {
  try {
    setUpdatingTask(taskId);

    const data = await apiFetch(
      `/api/analytics/planner-tasks/${taskId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      }
    );

    setPlannerTasks((previousTasks) =>
      previousTasks.map((task) =>
        task._id === taskId ? data.task : task
      )
    );
  } catch (err) {
    console.error("Task update failed:", err);
    alert(err.message || "Unable to update task");
  } finally {
    setUpdatingTask(null);
  }
}

  if (loading) {
    return (
      <div className="planner-state">
        <div className="planner-loader"></div>
        <h2>Preparing your DSA roadmap...</h2>
        <p>Analyzing your problem-solving performance.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="planner-state">
        <h2>Unable to load your planner</h2>
        <p>{error}</p>
        <Link to="/dashboard" className="planner-back-btn">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!strategy || !analytics) {
    return (
      <div className="planner-state">
        <h2>Your planner is not available yet</h2>
        <p>Add some DSA problems to generate your preparation roadmap.</p>
        <Link to="/add" className="planner-primary-btn">
          Add a Problem
        </Link>
      </div>
    );
  }

  const topicInsights = analytics.topicInsights || [];
  const totalAttempts = topicInsights.reduce(
    (sum, topic) => sum + topic.attempts,
    0,
  );

  const totalSolved = topicInsights.reduce(
    (sum, topic) => sum + topic.solved,
    0,
  );
  const completedTasks = plannerTasks.filter(
  (task) => task.completed
).length;

const totalTasks = plannerTasks.length;

const completionPercentage = totalTasks
  ? Math.round((completedTasks / totalTasks) * 100)
  : 0;

  return (
    <div className="ai-planner-page">
      {/* Page Header */}
      <div className="planner-topbar">
        <Link to="/dashboard" className="planner-back-link">
          ← Dashboard
        </Link>
        <span className="planner-status">✨ Personalized Learning</span>
      </div>

      <section className="planner-hero">
        <div>
          <span className="planner-eyebrow">YOUR PERSONAL DSA Guruji</span>

          <h1>AI DSA Planner</h1>

          <p>
            Understand your performance, strengthen weak areas and follow a
            structured roadmap to improve your problem-solving skills.
          </p>
        </div>

        <div className="planner-hero-icon">🧠</div>
      </section>

      {/* Performance Overview */}
      <section className="planner-section">
        <div className="planner-section-heading">
          <div>
            <span className="planner-eyebrow">YOUR PROGRESS</span>
            <h2>Performance Overview</h2>
          </div>
        </div>

        <div className="planner-stats-grid">
          <div className="planner-stat-card">
            <span className="planner-stat-icon">📝</span>
            <p>Total Attempts</p>
            <h3>{totalAttempts}</h3>
          </div>

          <div className="planner-stat-card">
            <span className="planner-stat-icon">✅</span>
            <p>Problems Solved</p>
            <h3>{totalSolved}</h3>
          </div>

          <div className="planner-stat-card">
            <span className="planner-stat-icon">📈</span>
            <p>Overall Accuracy</p>
            <h3>{Math.round((analytics.overallAccuracy || 0) * 100)}%</h3>
          </div>
        </div>
      </section>

      {/* Topic Analysis */}
      <section className="planner-section">
        <div className="planner-section-heading">
          <div>
            <span className="planner-eyebrow">KNOW YOUR WEAK AREAS</span>
            <h2>Topic-wise Analysis</h2>
          </div>
        </div>

        {topicInsights.length > 0 ? (
          <div className="planner-topic-grid">
            {topicInsights.map((topic) => (
              <div className="planner-topic-card" key={topic.topic}>
                <div className="planner-topic-heading">
                  <h3>{topic.topic}</h3>

                  <span
                    className={
                      topic.topic === strategy.topic
                        ? "topic-priority"
                        : "topic-normal"
                    }
                  >
                    {topic.topic === strategy.topic
                      ? "Priority"
                      : "In Progress"}
                  </span>
                </div>

                <div className="planner-topic-accuracy">
                  <strong>{topic.accuracy}%</strong>
                  <span>Accuracy</span>
                </div>

                <div className="planner-progress-track">
                  <div
                    className="planner-progress-fill"
                    style={{
                      width: `${Math.min(topic.accuracy, 100)}%`,
                    }}
                  ></div>
                </div>

                <div className="planner-topic-meta">
                  <span>
                    {topic.solved}/{topic.attempts} solved
                  </span>
                  <span>{topic.averageTime ?? "N/A"} min avg.</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No topic analytics available yet.</p>
        )}
      </section>

      {/* Priority Diagnosis */}
      <section className="planner-priority-card">
        <div className="priority-icon">🎯</div>

        <div>
          <span className="planner-eyebrow">YOUR TOP PRIORITY</span>

          <h2>{strategy.topic}</h2>

          <p>{strategy.diagnosis}</p>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="planner-section">
        <div className="planner-section-heading">
          <div>
            <span className="planner-eyebrow">YOUR LEARNING JOURNEY</span>
            <h2>Personalized Learning Roadmap</h2>
            <p>
              Follow these stages in sequence to strengthen your weakest topic.
            </p>
          </div>
        </div>

        <div className="planner-timeline">
          {strategy.practiceSequence?.map((step, index) => (
            <div className="planner-timeline-item" key={index}>
              <div className="timeline-marker">
                <span>{index + 1}</span>
              </div>

              <div className="timeline-content">
                <span className="timeline-phase">PHASE {index + 1}</span>

                <h3>
                  {[
                    "Build Strong Fundamentals",
                    "Strengthen Core Concepts",
                    "Develop Problem-Solving Skills",
                    "Master Advanced Patterns",
                  ][index] || `Learning Stage ${index + 1}`}
                </h3>

                <p>{step}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Roadmap Checklist */}
<section className="planner-section">

  <div className="planner-section-heading">
    <div>
      <span className="planner-eyebrow">
        TRACK YOUR LEARNING
      </span>
      <h2>Completion Checklist</h2>
      <p>Complete each stage as you make progress.</p>
    </div>
  </div>

  <div className="planner-checklist-card">

    <div className="planner-checklist-progress">
      <div>
        <strong>Overall Completion</strong>
        <span>
          {completedTasks}/{totalTasks} completed
        </span>
      </div>

      <h3>{completionPercentage}%</h3>
    </div>

    <div className="planner-checklist-track">
      <div
        className="planner-checklist-fill"
        style={{ width: `${completionPercentage}%` }}
      />
    </div>

    <div className="planner-task-list">
      {plannerTasks.map((task) => (
        <label
          className={`planner-task-item ${
            task.completed ? "completed" : ""
          }`}
          key={task._id}
        >
          <input
            type="checkbox"
            checked={task.completed}
            disabled={updatingTask === task._id}
            onChange={(e) =>
              handleTaskToggle(task._id, e.target.checked)
            }
          />

          <div className="planner-task-info">
            <strong>{task.title}</strong>
            <span>
              {task.topic} · Phase {task.phase}
            </span>
          </div>

          <span className="planner-task-status">
            {updatingTask === task._id
              ? "Saving..."
              : task.completed
                ? "Completed"
                : "Pending"}
          </span>
        </label>
      ))}
    </div>

    {totalTasks === 0 && (
      <p>No roadmap tasks available yet.</p>
    )}

  </div>
</section>

      {/* Weekly Plan */}
      <section className="planner-section">
        <div className="planner-section-heading">
          <div>
            <span className="planner-eyebrow">STAY CONSISTENT</span>
            <h2>Your Weekly Preparation Plan</h2>
          </div>
        </div>

        <div className="planner-week-grid">
          {strategy.weeklyPlan?.map((item, index) => (
            <div className="planner-week-card" key={index}>
              <div className="week-card-number">{index + 1}</div>

              <span>{item.day}</span>
              <p>{item.task}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Revision Advice */}
      <section className="planner-revision-card">
        <div className="revision-icon">🔄</div>

        <div>
          <h3>Smart Revision Strategy</h3>
          <p>{strategy.revisionPlan}</p>
        </div>
      </section>

      <div className="planner-footer">
        <p>
          Small improvements every day lead to stronger problem-solving skills.
        </p>

        <Link to="/add" className="planner-primary-btn">
          + Add New Problem
        </Link>
      </div>
    </div>
  );
}
