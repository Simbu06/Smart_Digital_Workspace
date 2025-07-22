import React, { useState } from "react";

const Tasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Finish project proposal",
      completed: false,
      priority: "high",
      dueDate: "Aug 25",
    },
    {
      id: 2,
      title: "Update presentation",
      completed: true,
      priority: "medium",
      dueDate: "Aug 23",
    },
    {
      id: 3,
      title: "Submit report",
      completed: false,
      priority: "high",
      dueDate: "Aug 26",
    },
    {
      id: 4,
      title: "Plan workshop",
      completed: false,
      priority: "low",
      dueDate: "Aug 30",
    },
    {
      id: 5,
      title: "Review team feedback",
      completed: false,
      priority: "medium",
      dueDate: "Aug 28",
    },
    {
      id: 6,
      title: "Prepare quarterly review",
      completed: false,
      priority: "high",
      dueDate: "Sep 1",
    },
  ]);

  const [newTask, setNewTask] = useState("");

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        title: newTask,
        completed: false,
        priority: "medium",
        dueDate: "Today",
      };
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h2>My Tasks</h2>
        <div className="add-task">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
          <button onClick={addTask}>Add</button>
        </div>
      </div>

      <div className="tasks-stats">
        <div className="stat">
          <h3>{tasks.filter((t) => !t.completed).length}</h3>
          <p>Pending</p>
        </div>
        <div className="stat">
          <h3>{tasks.filter((t) => t.completed).length}</h3>
          <p>Completed</p>
        </div>
        <div className="stat">
          <h3>
            {tasks.filter((t) => t.priority === "high" && !t.completed).length}
          </h3>
          <p>High Priority</p>
        </div>
      </div>

      <div className="tasks-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-card ${task.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <div className="task-content">
              <h4>{task.title}</h4>
              <div className="task-meta">
                <span
                  className="priority"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority}
                </span>
                <span className="due-date">Due: {task.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
