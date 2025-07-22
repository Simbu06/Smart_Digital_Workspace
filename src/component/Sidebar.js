import React from "react";

const Sidebar = ({
  activeSection,
  setActiveSection,
  showMobileMenu,
  setShowMobileMenu,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "files", label: "Files", icon: "📁" },
    { id: "tasks", label: "Tasks", icon: "✓" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "calendar", label: "Calendar", icon: "📅" },
  ];

  return (
    <div className={`sidebar ${showMobileMenu ? "mobile-open" : ""}`}>
      <div className="sidebar-header">
        <h2>Smart Digital</h2>
        <p>Workspace</p>
        {/* Close button for mobile */}
        <button
          className="mobile-close-btn"
          onClick={() => setShowMobileMenu(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? "active" : ""}`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
