import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

const Header = ({ showMobileMenu, setShowMobileMenu }) => {
  const { user, theme, searchQuery, notifications, dispatch, actions } =
    useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    dispatch({ type: actions.SET_SEARCH_QUERY, payload: e.target.value });
  };

  const toggleTheme = () => {
    // Add a smoother transition approach
    const root = document.documentElement;

    // Temporarily reduce transition speed for instant change
    root.style.setProperty("--theme-transition", "all 0.1s ease");

    dispatch({ type: actions.TOGGLE_THEME });

    // Restore normal transition speed after theme change
    requestAnimationFrame(() => {
      setTimeout(() => {
        root.style.setProperty(
          "--theme-transition",
          "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        );
      }, 100);
    });
  };

  const addNotification = (type, message) => {
    try {
      dispatch({
        type: actions.ADD_NOTIFICATION,
        payload: { type, message, timestamp: new Date() },
      });
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  const removeNotification = (id) => {
    try {
      dispatch({ type: actions.REMOVE_NOTIFICATION, payload: id });
    } catch (error) {
      console.error("Error removing notification:", error);
    }
  };

  const clearAllNotifications = () => {
    try {
      dispatch({ type: actions.CLEAR_ALL_NOTIFICATIONS });
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLogout = () => {
    dispatch({ type: actions.LOGOUT });
    dispatch({
      type: actions.ADD_NOTIFICATION,
      payload: {
        type: "info",
        message: "You have been logged out successfully.",
        timestamp: new Date(),
      },
    });
    setShowProfile(false);
  };

  return (
    <div className="enhanced-header">
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle mobile menu"
        >
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <h1>Smart Digital Workspace</h1>
        <div className="datetime-widget">
          <div className="current-time">{formatTime(currentTime)}</div>
          <div className="current-date">{formatDate(currentTime)}</div>
        </div>
      </div>

      <div className={`header-center ${showMobileMenu ? "mobile-open" : ""}`}>
        <div className="advanced-search">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Search files, tasks, meetings..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() =>
                dispatch({ type: actions.SET_SEARCH_QUERY, payload: "" })
              }
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className={`header-right ${showMobileMenu ? "mobile-open" : ""}`}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div className="notifications-container">
          <button
            className={`notifications-btn ${
              notifications.length > 0 ? "has-notifications" : ""
            }`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notifications</h3>
                <div className="notifications-actions">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="clear-all-btn"
                      title="Clear all notifications"
                    >
                      Clear All
                    </button>
                  )}
                  <button onClick={() => setShowNotifications(false)}>✕</button>
                </div>
              </div>
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="no-notifications">No new notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${notification.type}`}
                    >
                      <div className="notification-content">
                        <p>{notification.message}</p>
                        <small>
                          {notification.timestamp &&
                          notification.timestamp.toLocaleTimeString
                            ? notification.timestamp.toLocaleTimeString()
                            : "Invalid time"}
                        </small>
                      </div>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="remove-notification"
                        aria-label="Remove notification"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="notifications-actions">
                <button
                  onClick={() =>
                    addNotification("info", "Test notification added!")
                  }
                >
                  Add Test Notification
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="user-profile-container">
          <button
            className="user-profile-btn"
            onClick={() => setShowProfile(!showProfile)}
          >
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <span className="user-name">{user.name}</span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="profile-avatar"
                />
                <div className="profile-info">
                  <h3>{user.name}</h3>
                  <p>{user.role}</p>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="profile-menu">
                <button>👤 Edit Profile</button>
                <button>⚙️ Settings</button>
                <button>📊 Analytics</button>
                <button onClick={handleLogout}>🚪 Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
