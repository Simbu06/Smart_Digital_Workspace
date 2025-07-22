import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const EnhancedTasks = () => {
  const { searchQuery, dispatch, actions, tasks } = useApp();
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "medium",
    dueDate: "",
    category: "work",
    description: "",
    timeEstimate: "1h",
  });
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [draggedTask, setDraggedTask] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed) ||
      filter === task.priority ||
      filter === task.category;
    return matchesSearch && matchesFilter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return new Date(a.dueDate) - new Date(b.dueDate);
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const toggleTask = (id) => {
    try {
      const currentTask = tasks.find((task) => task.id === id);
      if (!currentTask) {
        console.error("Task not found:", id);
        return;
      }

      const wasCompleted = currentTask.completed;
      const newCompleted = !wasCompleted;

      // Toggle task in global state
      dispatch({
        type: actions.TOGGLE_TASK,
        payload: { id },
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

          dispatch({
            type: actions.ADD_NOTIFICATION,
            payload: {
              type: "success",
              message: `Task "${currentTask.title}" completed! 🎉`,
              timestamp: new Date(),
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

          dispatch({
            type: actions.ADD_NOTIFICATION,
            payload: {
              type: "info",
              message: `Task "${currentTask.title}" marked as incomplete`,
              timestamp: new Date(),
            },
          });
        }
      } catch (analyticsError) {
        console.error("Failed to update analytics:", analyticsError);
        dispatch({
          type: actions.ADD_NOTIFICATION,
          payload: {
            type: "warning",
            message: "Task updated but analytics sync failed",
            timestamp: new Date(),
          },
        });
      }
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

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        ...newTask,
        completed: false,
      };

      dispatch({
        type: actions.ADD_TASK,
        payload: task,
      });

      setNewTask({
        title: "",
        priority: "medium",
        dueDate: "",
        category: "work",
        description: "",
        timeEstimate: "1h",
      });
      setShowAddForm(false);
      dispatch({
        type: actions.ADD_NOTIFICATION,
        payload: {
          type: "info",
          message: `New task "${task.title}" added!`,
          timestamp: new Date(),
        },
      });
    }
  };

  const deleteTask = (id) => {
    dispatch({
      type: actions.DELETE_TASK,
      payload: id,
    });
    dispatch({
      type: actions.ADD_NOTIFICATION,
      payload: {
        type: "warning",
        message: "Task deleted",
        timestamp: new Date(),
      },
    });
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetTask) => {
    e.preventDefault();
    if (draggedTask && draggedTask.id !== targetTask.id) {
      const newTasks = [...tasks];
      const draggedIndex = newTasks.findIndex((t) => t.id === draggedTask.id);
      const targetIndex = newTasks.findIndex((t) => t.id === targetTask.id);

      newTasks.splice(draggedIndex, 1);
      newTasks.splice(targetIndex, 0, draggedTask);

      dispatch({
        type: actions.SET_TASKS,
        payload: newTasks,
      });
    }
    setDraggedTask(null);
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case "work":
        return "💼";
      case "personal":
        return "👤";
      case "urgent":
        return "🚨";
      default:
        return "📝";
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(
      (t) => !t.completed && getDaysUntilDue(t.dueDate) < 0
    ).length;
    const highPriority = tasks.filter(
      (t) => !t.completed && t.priority === "high"
    ).length;

    return { total, completed, pending, overdue, highPriority };
  };

  const stats = getTaskStats();

  return (
    <div className="enhanced-tasks-page">
      <div className="tasks-header">
        <h2>Enhanced Task Management</h2>
        <button
          className="add-task-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          ➕ Add New Task
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="task-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card overdue">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <h3>{stats.overdue}</h3>
            <p>Overdue</p>
          </div>
        </div>
        <div className="stat-card high-priority">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{stats.highPriority}</h3>
            <p>High Priority</p>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="add-task-form">
          <h3>Create New Task</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Task title..."
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <textarea
              placeholder="Task description..."
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <select
              value={newTask.category}
              onChange={(e) =>
                setNewTask({ ...newTask, category: e.target.value })
              }
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="urgent">Urgent</option>
            </select>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Time estimate (e.g., 2h)"
              value={newTask.timeEstimate}
              onChange={(e) =>
                setNewTask({ ...newTask, timeEstimate: e.target.value })
              }
            />
          </div>
          <div className="form-actions">
            <button onClick={addTask} className="btn-primary">
              Add Task
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters and Sorting */}
      <div className="tasks-controls">
        <div className="filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            className={filter === "high" ? "active" : ""}
            onClick={() => setFilter("high")}
          >
            High Priority
          </button>
          <button
            className={filter === "work" ? "active" : ""}
            onClick={() => setFilter("work")}
          >
            Work
          </button>
          <button
            className={filter === "personal" ? "active" : ""}
            onClick={() => setFilter("personal")}
          >
            Personal
          </button>
        </div>
        <div className="sorting">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="enhanced-tasks-list">
        {sortedTasks.map((task) => {
          const daysUntilDue = getDaysUntilDue(task.dueDate);
          const isOverdue = daysUntilDue < 0 && !task.completed;
          const isDueSoon =
            daysUntilDue <= 2 && daysUntilDue >= 0 && !task.completed;

          return (
            <div
              key={task.id}
              className={`enhanced-task-card ${
                task.completed ? "completed" : ""
              } ${isOverdue ? "overdue" : ""} ${isDueSoon ? "due-soon" : ""}`}
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, task)}
            >
              <div className="task-main">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="task-checkbox"
                />
                <div className="task-content">
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    <div className="task-meta">
                      <span className="category-icon">
                        {getCategoryIcon(task.category)}
                      </span>
                      <span
                        className="priority-badge"
                        style={{
                          backgroundColor: getPriorityColor(task.priority),
                        }}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-footer">
                    <span className="due-date">
                      📅 {new Date(task.dueDate).toLocaleDateString()}
                      {isOverdue && (
                        <span className="overdue-text"> (Overdue)</span>
                      )}
                      {isDueSoon && (
                        <span className="due-soon-text"> (Due Soon)</span>
                      )}
                    </span>
                    <span className="time-estimate">
                      ⏱️ {task.timeEstimate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="task-actions">
                <button
                  onClick={() => deleteTask(task.id)}
                  className="delete-btn"
                >
                  🗑️
                </button>
                <div className="drag-handle">⋮⋮</div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedTasks.length === 0 && (
        <div className="no-tasks">
          <h3>No tasks found</h3>
          <p>Try adjusting your filters or add a new task!</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedTasks;
