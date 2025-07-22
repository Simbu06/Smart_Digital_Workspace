import React from "react";
import { useApp } from "../context/AppContext";

const Dashboard = () => {
  const { dispatch, actions, tasks } = useApp();

  const handleTaskToggle = (taskId) => {
    try {
      const currentTask = tasks.find((t) => t.id === taskId);
      if (!currentTask) {
        console.error("Task not found:", taskId);
        return;
      }

      const wasCompleted = currentTask.completed;
      const newCompleted = !wasCompleted;

      // Toggle task in global state
      dispatch({
        type: actions.TOGGLE_TASK,
        payload: { id: taskId },
      });

      // Update analytics in global state with error handling
      try {
        if (newCompleted && !wasCompleted) {
          // Task was just completed
          dispatch({
            type: actions.UPDATE_ANALYTICS,
            payload: {
              tasksCompleted: 1,
            },
          });
        } else if (!newCompleted && wasCompleted) {
          // Task was marked as incomplete
          dispatch({
            type: actions.UPDATE_ANALYTICS,
            payload: {
              tasksCompleted: -1,
            },
          });
        }
      } catch (analyticsError) {
        console.error("Failed to update analytics:", analyticsError);
      }

      const message = wasCompleted
        ? `Task "${currentTask.title || currentTask.text}" marked as incomplete`
        : `Task "${currentTask.title || currentTask.text}" completed!`;

      dispatch({
        type: actions.ADD_NOTIFICATION,
        payload: {
          type: wasCompleted ? "info" : "success",
          message: message,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error("Error toggling task:", error);
      dispatch({
        type: actions.ADD_NOTIFICATION,
        payload: {
          type: "error",
          message: "Failed to update task",
          timestamp: new Date(),
        },
      });
    }
  };
  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <div className="files-section">
          <div className="section-header">
            <h3>Files</h3>
            <div className="tabs">
              <button className="tab active">All</button>
              <button className="tab">New</button>
              <button className="tab">Shared</button>
              <button className="tab">Starred</button>
            </div>
          </div>
          <div className="files-list">
            <div className="file-item">
              <span className="file-icon">📁</span>
              <span className="file-name">Project Plans</span>
            </div>
            <div className="file-item">
              <span className="file-icon">📁</span>
              <span className="file-name">Marketing</span>
            </div>
            <div className="file-item">
              <span className="file-icon">📄</span>
              <span className="file-name">Workshop Slides</span>
            </div>
            <div className="file-item">
              <span className="file-icon">📄</span>
              <span className="file-name">Meeting Notes</span>
            </div>
            <div className="file-item">
              <span className="file-icon">📄</span>
              <span className="file-name">Presentation.pptx</span>
            </div>
            <div className="file-item">
              <span className="file-icon">📄</span>
              <span className="file-name">Report Q1.docx</span>
            </div>
          </div>

          <div className="my-tasks">
            <h3>My Tasks</h3>
            <div className="task-list">
              {tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskToggle(task.id)}
                    id={`task-${task.id}`}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={task.completed ? "completed" : ""}
                  >
                    {task.title || task.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-right">
          <div className="analytics-chart">
            <h3>Dashboard</h3>
            <div className="chart-container">
              <svg viewBox="0 0 200 100" className="chart">
                <polyline
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="2"
                  points="0,80 40,60 80,40 120,30 160,20 200,10"
                />
              </svg>
              <div className="chart-legend">
                <div className="legend-item">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>
              </div>
            </div>
          </div>

          <div className="upcoming-meetings">
            <h3>Upcoming Meetings</h3>
            <div className="meeting-item">
              <div className="meeting-time">10:00</div>
              <div className="meeting-details">
                <div className="meeting-date">Aug 28</div>
                <div className="meeting-title">Team Sync</div>
              </div>
            </div>
            <div className="meeting-item">
              <div className="meeting-time">13:00</div>
              <div className="meeting-details">
                <div className="meeting-date">Aug 29</div>
                <div className="meeting-title">Project Review</div>
              </div>
            </div>
            <div className="meeting-item">
              <div className="meeting-time">09:00</div>
              <div className="meeting-details">
                <div className="meeting-date">Aug 30</div>
                <div className="meeting-title">Client Call</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
