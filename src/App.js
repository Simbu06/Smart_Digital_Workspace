import React, { useState, useEffect } from "react";
import { AppProvider } from "./context/AppContext";
import { useApp } from "./context/AppContext";
import Sidebar from "./component/Sidebar";
import Header from "./component/Header";
import Dashboard from "./component/Dashboard";
import Files from "./component/Files";
import EnhancedTasks from "./component/EnhancedTasks";
import Analytics from "./component/Analytics";
import Calendar from "./component/Calendar";
import Auth from "./component/Auth";
import Loading from "./component/Loading";
import "./App.css";

function AppContent() {
  const { isAuthenticated } = useApp();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    "Loading Smart Digital Workspace"
  );
  const [sectionLoading, setSectionLoading] = useState(false);

  // Initial loading sequence
  useEffect(() => {
    const loadingSteps = [
      { message: "Initializing workspace", duration: 800 },
      { message: "Loading user data", duration: 600 },
      { message: "Setting up dashboard", duration: 700 },
      { message: "Preparing components", duration: 500 },
    ];

    let currentStep = 0;
    const runLoadingSequence = () => {
      if (currentStep < loadingSteps.length) {
        setLoadingMessage(loadingSteps[currentStep].message);
        setTimeout(() => {
          currentStep++;
          runLoadingSequence();
        }, loadingSteps[currentStep].duration);
      } else {
        // Final step - complete loading
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };

    runLoadingSequence();
  }, []);

  // Show loading screen first
  if (isLoading) {
    return (
      <Loading
        message={loadingMessage}
        subtext="Please wait while we prepare your workspace"
      />
    );
  }

  // Show authentication screen if not authenticated
  if (!isAuthenticated) {
    return <Auth />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "files":
        return <Files />;
      case "tasks":
        return <EnhancedTasks />;
      case "analytics":
        return <Analytics />;
      case "calendar":
        return <Calendar />;
      default:
        return <Dashboard />;
    }
  };

  const handleSectionChange = (section) => {
    if (section === activeSection) return; // Don't reload if same section

    setSectionLoading(true);
    setShowMobileMenu(false); // Close mobile menu when section changes

    // Simulate section loading time
    setTimeout(() => {
      setActiveSection(section);
      setSectionLoading(false);
    }, 300);
  };

  return (
    <div className="app">
      {/* Mobile menu backdrop */}
      {showMobileMenu && (
        <div
          className={`sidebar-backdrop ${showMobileMenu ? "active" : ""}`}
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      <Sidebar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />
      <div className="main-content">
        <Header
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />
        <div className="content-area">
          {sectionLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "400px",
                flexDirection: "column",
              }}
            >
              <div
                className="loading-spinner"
                style={{ width: "40px", height: "40px", marginBottom: "1rem" }}
              ></div>
              <div
                style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}
              >
                Loading {activeSection}...
              </div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
