import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const Calendar = () => {
  const { dispatch, actions } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendedMeetings, setAttendedMeetings] = useState(new Set());

  const meetings = [
    {
      id: 1,
      time: "10:00",
      date: "Aug 28",
      title: "Team Sync",
      type: "meeting",
    },
    {
      id: 2,
      time: "13:00",
      date: "Aug 29",
      title: "Project Review",
      type: "meeting",
    },
    {
      id: 3,
      time: "09:00",
      date: "Aug 30",
      title: "Client Call",
      type: "call",
    },
    {
      id: 4,
      time: "14:30",
      date: "Sep 2",
      title: "Workshop Planning",
      type: "workshop",
    },
    {
      id: 5,
      time: "11:00",
      date: "Sep 3",
      title: "Budget Review",
      type: "meeting",
    },
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleMeetingAttendance = (meetingId, meetingTitle) => {
    if (attendedMeetings.has(meetingId)) {
      return; // Already attended, prevent multiple clicks
    }

    setAttendedMeetings((prev) => new Set(prev).add(meetingId));

    dispatch({
      type: actions.UPDATE_ANALYTICS,
      payload: {
        meetingsAttended: 1,
      },
    });

    dispatch({
      type: actions.ADD_NOTIFICATION,
      payload: {
        type: "success",
        message: `Attended "${meetingTitle}" meeting! 📅`,
        timestamp: new Date(),
      },
    });
  };

  const getEventType = (type) => {
    switch (type) {
      case "meeting":
        return "📅";
      case "call":
        return "📞";
      case "workshop":
        return "🎯";
      default:
        return "📅";
    }
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h2>Calendar</h2>
        <div className="calendar-nav">
          <button onClick={previousMonth}>‹</button>
          <h3>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button onClick={nextMonth}>›</button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-days">
          {dayNames.map((day) => (
            <div key={day} className="day-header">
              {day}
            </div>
          ))}
          {getDaysInMonth(currentDate).map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${day ? "active" : "inactive"}`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="upcoming-events">
        <h3>Upcoming Events</h3>
        <div className="events-list">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="event-item">
              <div className="event-time">
                <span className="time">{meeting.time}</span>
                <span className="date">{meeting.date}</span>
              </div>
              <div className="event-details">
                <span className="event-icon">{getEventType(meeting.type)}</span>
                <span className="event-title">{meeting.title}</span>
              </div>
              <button
                className={`attend-btn ${
                  attendedMeetings.has(meeting.id) ? "attended" : ""
                }`}
                onClick={() =>
                  handleMeetingAttendance(meeting.id, meeting.title)
                }
                disabled={attendedMeetings.has(meeting.id)}
              >
                {attendedMeetings.has(meeting.id) ? "✓ Attended" : "✓ Attend"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
