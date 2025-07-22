import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const Auth = () => {
  const { dispatch, actions } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    company: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Signup specific validations
    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (isLogin) {
        // Simulate login
        const userData = {
          name: "Sarah Johnson",
          email: formData.email,
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b784?w=400&h=400&fit=crop&crop=face",
          role: "Project Manager",
          department: "Digital Innovation",
        };

        dispatch({
          type: actions.UPDATE_USER,
          payload: userData,
        });

        dispatch({
          type: actions.ADD_NOTIFICATION,
          payload: {
            type: "success",
            message: "Welcome back! Successfully logged in.",
            timestamp: new Date(),
          },
        });

        // Set authentication status
        dispatch({
          type: actions.SET_AUTH_STATUS,
          payload: true,
        });
      } else {
        // Simulate signup
        const userData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
          role: "Team Member",
          department: formData.company || "Digital Innovation",
        };

        dispatch({
          type: actions.UPDATE_USER,
          payload: userData,
        });

        dispatch({
          type: actions.ADD_NOTIFICATION,
          payload: {
            type: "success",
            message: "Account created successfully! Welcome to the workspace.",
            timestamp: new Date(),
          },
        });

        // Set authentication status
        dispatch({
          type: actions.SET_AUTH_STATUS,
          payload: true,
        });
      }
    } catch (error) {
      dispatch({
        type: actions.ADD_NOTIFICATION,
        payload: {
          type: "error",
          message: "Authentication failed. Please try again.",
          timestamp: new Date(),
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      company: "",
    });
    setErrors({});
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const demoUser = {
        name: "Demo User",
        email: "demo@workspace.com",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
        role: "Demo Account",
        department: "Digital Innovation",
      };

      dispatch({
        type: actions.UPDATE_USER,
        payload: demoUser,
      });

      dispatch({
        type: actions.ADD_NOTIFICATION,
        payload: {
          type: "info",
          message: "Welcome to the demo workspace!",
          timestamp: new Date(),
        },
      });

      dispatch({
        type: actions.SET_AUTH_STATUS,
        payload: true,
      });

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-pattern"></div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="8" fill="url(#gradient)" />
                <path
                  d="M12 28V16L20 12L28 16V28H24V20H16V28H12Z"
                  fill="white"
                />
                <path d="M18 22H22V26H18V22Z" fill="url(#gradient)" />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0"
                    y1="0"
                    x2="40"
                    y2="40"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#3B82F6" />
                    <stop offset="1" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1>Smart Workspace</h1>
          </div>
          <p className="auth-subtitle">
            {isLogin
              ? "Welcome back! Sign in to your account"
              : "Create your account to get started"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? "error" : ""}
                  placeholder="John"
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? "error" : ""}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "error" : ""}
              placeholder="john@company.com"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="company">Company (Optional)</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Your Company"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? "error" : ""}
              placeholder="••••••••"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? "error" : ""}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button
            type="submit"
            className={`auth-submit ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="auth-loading-spinner">
                <div className="spinner"></div>
                <span className="loading-text">
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              </div>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            type="button"
            className="demo-button"
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            <span className="demo-icon">🎮</span>
            Try Demo Account
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              className="auth-toggle"
              onClick={toggleAuthMode}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
