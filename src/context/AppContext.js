import React, { createContext, useContext, useReducer, useEffect } from "react";

// Initial state
const initialState = {
  theme: "light",
  isAuthenticated: false,
  user: {
    name: "Guest User",
    email: "",
    avatar: "",
    role: "Guest",
    department: "",
  },
  notifications: [],
  searchQuery: "",
  tasks: [],
  analytics: {
    tasksCompleted: 0,
    filesUploaded: 0,
    meetingsAttended: 0,
    productivityScore: 0,
  },
  settings: {
    notifications: true,
    darkMode: false,
    language: "en",
    timezone: "UTC-5",
  },
};

// Action types
const ACTIONS = {
  TOGGLE_THEME: "TOGGLE_THEME",
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION",
  CLEAR_ALL_NOTIFICATIONS: "CLEAR_ALL_NOTIFICATIONS",
  UPDATE_USER: "UPDATE_USER",
  UPDATE_SETTINGS: "UPDATE_SETTINGS",
  UPDATE_ANALYTICS: "UPDATE_ANALYTICS",
  RESET_ANALYTICS: "RESET_ANALYTICS",
  SET_AUTH_STATUS: "SET_AUTH_STATUS",
  LOGOUT: "LOGOUT",
  ADD_TASK: "ADD_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  TOGGLE_TASK: "TOGGLE_TASK",
  SET_TASKS: "SET_TASKS",
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
        settings: { ...state.settings, darkMode: !state.settings.darkMode },
      };
    case ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          { id: Date.now(), ...action.payload },
        ],
      };
    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };
    case ACTIONS.CLEAR_ALL_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };
    case ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
    case ACTIONS.UPDATE_SETTINGS:
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case ACTIONS.UPDATE_ANALYTICS:
      const newTasksCompleted = Math.max(
        0,
        state.analytics.tasksCompleted + (action.payload.tasksCompleted || 0)
      );
      const newFilesUploaded = Math.max(
        0,
        state.analytics.filesUploaded + (action.payload.filesUploaded || 0)
      );
      const newMeetingsAttended = Math.max(
        0,
        state.analytics.meetingsAttended +
          (action.payload.meetingsAttended || 0)
      );

      // Calculate productivity score based on recent activity (more realistic approach)
      const baseScore = 20; // Base productivity score
      const taskBonus = Math.min(30, newTasksCompleted * 2); // Max 30 points from tasks
      const fileBonus = Math.min(25, newFilesUploaded * 3); // Max 25 points from files
      const meetingBonus = Math.min(25, newMeetingsAttended * 5); // Max 25 points from meetings

      const calculatedScore = baseScore + taskBonus + fileBonus + meetingBonus;
      const newProductivityScore =
        action.payload.productivityScore !== undefined
          ? Math.max(0, Math.min(100, action.payload.productivityScore))
          : Math.min(100, Math.max(0, calculatedScore));

      return {
        ...state,
        analytics: {
          ...state.analytics,
          tasksCompleted: newTasksCompleted,
          filesUploaded: newFilesUploaded,
          meetingsAttended: newMeetingsAttended,
          productivityScore: newProductivityScore,
        },
      };
    case ACTIONS.RESET_ANALYTICS:
      return {
        ...state,
        analytics: {
          tasksCompleted: 0,
          filesUploaded: 0,
          meetingsAttended: 0,
          productivityScore: 20,
        },
      };
    case ACTIONS.SET_AUTH_STATUS:
      return { ...state, isAuthenticated: action.payload };
    case ACTIONS.LOGOUT:
      return {
        ...initialState,
        theme: state.theme, // Preserve theme preference
        settings: state.settings, // Preserve settings
      };
    case ACTIONS.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };
    case ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case ACTIONS.TOGGLE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    case ACTIONS.SET_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load theme from localStorage on mount (only once)
  useEffect(() => {
    const savedTheme = localStorage.getItem("workspace-theme");
    if (savedTheme && savedTheme !== initialState.theme) {
      dispatch({ type: ACTIONS.TOGGLE_THEME });
    }
    // Set initial theme attribute
    document.documentElement.setAttribute(
      "data-theme",
      savedTheme || initialState.theme
    );
  }, []); // Empty dependency array - run only once on mount

  // Save theme to localStorage and update DOM when theme changes
  useEffect(() => {
    localStorage.setItem("workspace-theme", state.theme);
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  const value = {
    ...state,
    dispatch,
    actions: ACTIONS,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export default AppContext;
