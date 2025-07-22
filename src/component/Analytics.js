import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

const Analytics = () => {
  const { analytics, dispatch, actions, tasks } = useApp();
  const [chartData, setChartData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const handleResetAnalytics = () => {
    dispatch({ type: actions.RESET_ANALYTICS });
    dispatch({
      type: actions.ADD_NOTIFICATION,
      payload: {
        type: "info",
        message: "Analytics data has been reset",
        timestamp: new Date(),
      },
    });
  };

  // Calculate real task distribution
  const getTaskDistribution = () => {
    const completed = tasks.filter((task) => task.completed).length;
    const pending = tasks.filter((task) => !task.completed).length;
    const overdue = tasks.filter((task) => {
      if (task.completed || !task.dueDate) return false;
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    }).length;

    return [
      { label: "Completed", value: completed, color: "#10b981" },
      { label: "Pending", value: pending - overdue, color: "#3b82f6" },
      { label: "Overdue", value: overdue, color: "#ef4444" },
    ].filter((item) => item.value > 0); // Only show non-zero values
  };

  useEffect(() => {
    // Generate mock data for different periods
    const generateData = () => {
      const periods = {
        week: 7,
        month: 30,
        quarter: 90,
      };

      const days = periods[selectedPeriod];
      const data = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          tasks: Math.floor(Math.random() * 10) + 1,
          productivity: Math.floor(Math.random() * 40) + 60,
          meetings: Math.floor(Math.random() * 3) + 1,
          files: Math.floor(Math.random() * 5) + 1,
        });
      }

      setChartData(data);
    };

    generateData();
  }, [selectedPeriod]);

  const LineChart = ({ data, metric, color }) => {
    const maxValue = Math.max(...data.map((d) => d[metric]));
    const points = data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * 300;
        const y = 100 - (d[metric] / maxValue) * 80;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="chart-container">
        <svg viewBox="0 0 300 100" className="line-chart">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={points}
          />
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 300;
            const y = 100 - (d[metric] / maxValue) * 80;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                className="chart-point"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const BarChart = ({ data, metric, color }) => {
    const maxValue = Math.max(...data.map((d) => d[metric]));

    return (
      <div className="bar-chart">
        {data.slice(-7).map((d, i) => {
          const height = (d[metric] / maxValue) * 80;
          return (
            <div key={i} className="bar-container">
              <div
                className="bar"
                style={{
                  height: `${height}%`,
                  backgroundColor: color,
                }}
              />
              <span className="bar-label">{d.date}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const PieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="pie-chart-container">
        <svg viewBox="0 0 100 100" className="pie-chart">
          {data.map((item, i) => {
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle += angle;

            const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            return (
              <path
                key={i}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={item.color}
                className="pie-slice"
              />
            );
          })}
        </svg>
        <div className="pie-chart-legend">
          {data.map((item, i) => (
            <div key={i} className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: item.color }}
              />
              <span>
                {item.label}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const pieData = getTaskDistribution();

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <div className="header-controls">
          <div className="period-selector">
            <button
              className={selectedPeriod === "week" ? "active" : ""}
              onClick={() => setSelectedPeriod("week")}
            >
              Week
            </button>
            <button
              className={selectedPeriod === "month" ? "active" : ""}
              onClick={() => setSelectedPeriod("month")}
            >
              Month
            </button>
            <button
              className={selectedPeriod === "quarter" ? "active" : ""}
              onClick={() => setSelectedPeriod("quarter")}
            >
              Quarter
            </button>
          </div>
          <button className="reset-btn" onClick={handleResetAnalytics}>
            Reset Analytics
          </button>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>📈 Productivity Trend</h3>
          <LineChart data={chartData} metric="productivity" color="#3b82f6" />
          <p>
            Average:{" "}
            {Math.min(100, Math.max(0, analytics.productivityScore)).toFixed(1)}
            %
          </p>
        </div>

        <div className="analytics-card">
          <h3>✅ Tasks Completed</h3>
          <BarChart data={chartData} metric="tasks" color="#10b981" />
          <p>
            Total this {selectedPeriod}: {analytics.tasksCompleted}
          </p>
        </div>

        <div className="analytics-card">
          <h3>📊 Task Distribution</h3>
          {pieData.length > 0 ? (
            <PieChart data={pieData} />
          ) : (
            <div className="no-data">
              <p>No tasks available</p>
              <span>Add some tasks to see the distribution</span>
            </div>
          )}
        </div>

        <div className="analytics-card">
          <h3>📁 Files Activity</h3>
          <LineChart data={chartData} metric="files" color="#8b5cf6" />
          <p>Files uploaded: {analytics.filesUploaded}</p>
        </div>

        <div className="analytics-card">
          <h3>🎯 Goals Progress</h3>
          <div className="progress-rings">
            <div className="progress-ring">
              <svg viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray={`${
                    Math.min(100, Math.max(0, analytics.productivityScore)) *
                    3.14
                  } 314`}
                  transform="rotate(-90 60 60)"
                />
                <text
                  x="60"
                  y="65"
                  textAnchor="middle"
                  fontSize="16"
                  fill="currentColor"
                >
                  {Math.min(
                    100,
                    Math.max(0, analytics.productivityScore)
                  ).toFixed(0)}
                  %
                </text>
              </svg>
              <p>Productivity</p>
            </div>
          </div>
        </div>

        <div className="analytics-card stats-grid">
          <h3>📊 Quick Stats</h3>
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-value">{analytics.tasksCompleted}</span>
              <span className="stat-label">Tasks Done</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{analytics.meetingsAttended}</span>
              <span className="stat-label">Meetings</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{analytics.filesUploaded}</span>
              <span className="stat-label">Files</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">24h</span>
              <span className="stat-label">Focus Time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
