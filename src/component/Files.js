import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const Files = () => {
  const { dispatch, actions } = useApp();
  const [activeTab, setActiveTab] = useState("all");

  const files = [
    {
      id: 1,
      name: "Project Plans",
      type: "folder",
      size: "",
      modified: "2 days ago",
    },
    {
      id: 2,
      name: "Marketing",
      type: "folder",
      size: "",
      modified: "1 week ago",
    },
    {
      id: 3,
      name: "Workshop Slides",
      type: "pptx",
      size: "2.4 MB",
      modified: "3 hours ago",
    },
    {
      id: 4,
      name: "Meeting Notes",
      type: "docx",
      size: "1.2 MB",
      modified: "1 day ago",
    },
    {
      id: 5,
      name: "Presentation.pptx",
      type: "pptx",
      size: "5.8 MB",
      modified: "2 days ago",
    },
    {
      id: 6,
      name: "Report Q1.docx",
      type: "docx",
      size: "3.1 MB",
      modified: "1 week ago",
    },
    {
      id: 7,
      name: "Budget 2024.xlsx",
      type: "xlsx",
      size: "890 KB",
      modified: "3 days ago",
    },
    {
      id: 8,
      name: "Team Photos",
      type: "folder",
      size: "",
      modified: "2 weeks ago",
    },
  ];

  const handleFileUpload = () => {
    // Simulate file upload
    dispatch({
      type: actions.UPDATE_ANALYTICS,
      payload: {
        filesUploaded: 1,
      },
    });

    dispatch({
      type: actions.ADD_NOTIFICATION,
      payload: {
        type: "success",
        message: "File uploaded successfully! 📁",
        timestamp: new Date(),
      },
    });
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "folder":
        return "📁";
      case "pptx":
        return "📊";
      case "docx":
        return "📄";
      case "xlsx":
        return "📋";
      default:
        return "📄";
    }
  };

  return (
    <div className="files-page">
      <div className="files-header">
        <h2>Files</h2>
        <div className="files-header-actions">
          <div className="files-tabs">
            <button
              className={`tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`tab ${activeTab === "new" ? "active" : ""}`}
              onClick={() => setActiveTab("new")}
            >
              New
            </button>
            <button
              className={`tab ${activeTab === "shared" ? "active" : ""}`}
              onClick={() => setActiveTab("shared")}
            >
              Shared
            </button>
            <button
              className={`tab ${activeTab === "starred" ? "active" : ""}`}
              onClick={() => setActiveTab("starred")}
            >
              Starred
            </button>
          </div>
          <button className="upload-btn" onClick={handleFileUpload}>
            📤 Upload File
          </button>
        </div>
      </div>

      <div className="files-grid">
        {files.map((file) => (
          <div key={file.id} className="file-card">
            <div className="file-icon-large">{getFileIcon(file.type)}</div>
            <div className="file-info">
              <h4>{file.name}</h4>
              <p>
                {file.size} • {file.modified}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Files;
