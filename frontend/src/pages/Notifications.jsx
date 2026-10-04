import { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    fetchNotifications();
  }, []);

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/notifications/${user.id}`
      );

      setNotifications(response.data.notifications || []);
      setLoading(false);
    } catch (error) {
      console.log("Notification Error:", error);
      setLoading(false);
    }
  };

  // MARK ONE NOTIFICATION AS READ
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${notificationId}/read`
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.log("Mark Read Error:", error);
    }
  };

  // MARK ALL NOTIFICATIONS AS READ
  const markAllAsRead = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/user/${user.id}/read-all`
      );

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.log("Mark All Read Error:", error);
    }
  };

  // GO TO DASHBOARD
  const goDashboard = () => {
    if (user.role === "mentor") {
      window.location.href = "/mentor-dashboard";
    } else {
      window.location.href = "/student-dashboard";
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedMentor");
    localStorage.removeItem("selectedMentorId");
    localStorage.removeItem("selectedChatUser");

    window.location.href = "/login";
  };

  // COUNT UNREAD
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // LOADING
  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="empty-box">
            <h2>Loading notifications...</h2>
            <p>Please wait.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>CareerConnect</h2>

        <p>
          {user.role === "mentor"
            ? "Mentor Panel"
            : "Student Panel"}
        </p>

        <nav>
          {/* DASHBOARD */}
          <a href="#" onClick={goDashboard}>
            🏠 Dashboard
          </a>

          {/* STUDENT LINKS */}
          {user.role === "student" && (
            <>
              <a href="/profile">
                👤 My Profile
              </a>

              <a href="/find-mentors">
                🔎 Find Mentors
              </a>

              <a href="/mentorship">
                🎓 Mentorship
              </a>
            </>
          )}

          {/* NOTIFICATIONS */}
          <a href="/notifications" className="active">
            🔔 Notifications

            {unreadCount > 0 && (
              <span
                style={{
                  marginLeft: "8px",
                  background: "#ef4444",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 7px",
                  fontSize: "12px",
                }}
              >
                {unreadCount}
              </span>
            )}
          </a>

          {/* JOBS */}
          <a href="#">
            💼 Jobs
          </a>
        </nav>

        {/* LOGOUT */}
        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <h1>🔔 Notifications</h1>

            <p>
              Stay updated with your mentorship and messages.
            </p>
          </div>

          <button
            onClick={goDashboard}
            className="back-dashboard-btn"
          >
            ← Back
          </button>
        </div>

        {/* NOTIFICATIONS SECTION */}
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Your Notifications</h2>

              <p>
                {unreadCount} unread notification
                {unreadCount !== 1 ? "s" : ""}
              </p>
            </div>

            {/* MARK ALL AS READ */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="start-mentorship-btn"
              >
                ✓ Mark All as Read
              </button>
            )}
          </div>

          {/* NO NOTIFICATIONS */}
          {notifications.length === 0 ? (
            <div className="empty-box">
              <div
                style={{
                  fontSize: "50px",
                }}
              >
                🔔
              </div>

              <h3>
                No notifications yet
              </h3>

              <p>
                You will see important updates here.
              </p>
            </div>
          ) : (
            /* NOTIFICATION LIST */
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() =>
                    !notification.read &&
                    markAsRead(notification._id)
                  }
                  style={{
                    padding: "18px",
                    marginBottom: "12px",
                    borderRadius: "12px",
                    border: "1px solid #ddd",
                    background: notification.read
                      ? "#ffffff"
                      : "#eff6ff",
                    cursor: notification.read
                      ? "default"
                      : "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "15px",
                    }}
                  >
                    <div>
                      {/* TITLE */}
                      <h3
                        style={{
                          marginBottom: "6px",
                        }}
                      >
                        {notification.title}
                      </h3>

                      {/* MESSAGE */}
                      <p
                        style={{
                          marginBottom: "8px",
                        }}
                      >
                        {notification.message}
                      </p>

                      {/* DATE */}
                      <small>
                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
                      </small>
                    </div>

                    {/* NEW BADGE */}
                    {!notification.read && (
                      <span
                        style={{
                          background: "#2563eb",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          height: "fit-content",
                          fontSize: "12px",
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Notifications;