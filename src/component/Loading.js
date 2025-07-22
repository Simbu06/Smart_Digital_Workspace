import React from "react";

const Loading = ({
  message = "Loading Smart Digital Workspace",
  subtext = "Please wait while we prepare your workspace",
}) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">
        {message}
        <span className="loading-dots"></span>
      </div>
      <div className="loading-subtext">{subtext}</div>
    </div>
  );
};

export default Loading;
