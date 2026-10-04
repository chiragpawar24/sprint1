import { useEffect, useState } from "react";
import axios from "axios";

function MessageMentor() {
  const [chatUser, setChatUser] = useState(null);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      window.location.href = "/login";
      return;
    }

    const currentUser = JSON.parse(savedUser);
    setUser(currentUser);

    // Student side
    const savedMentor =
      localStorage.getItem("selectedMentor");

    // Mentor side
    const savedChatUser =
      localStorage.getItem("selectedChatUser");

    let otherUser = null;

    if (currentUser.role === "student") {
      if (savedMentor) {
        otherUser = JSON.parse(savedMentor);
      }
    }

    if (currentUser.role === "mentor") {
      if (savedChatUser) {
        otherUser = JSON.parse(savedChatUser);
      }
    }

    if (!otherUser) {
      setLoading(false);
      return;
    }

    setChatUser(otherUser);

    fetchMessages(
      currentUser.id,
      otherUser._id
    );
  }, []);

  const fetchMessages = async (
    currentUserId,
    otherUserId
  ) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/${currentUserId}/${otherUserId}`
      );

      setMessages(
        response.data.messages || []
      );

      setLoading(false);
    } catch (error) {
      console.log(
        "Fetch Messages Error:",
        error
      );

      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }

    if (!user?.id || !chatUser?._id) {
      alert(
        "Chat user information not available."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/messages",
        {
          sender: user.id,
          receiver: chatUser._id,
          message: newMessage.trim(),
        }
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        response.data.data,
      ]);

      setNewMessage("");
    } catch (error) {
      console.log(
        "Send Message Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to send message"
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const goBack = () => {
    if (user?.role === "mentor") {
      window.location.href =
        "/mentor-dashboard";
    } else {
      window.location.href =
        "/mentorship";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedMentor");
    localStorage.removeItem("selectedMentorId");
    localStorage.removeItem("selectedChatUser");

    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="empty-box">
            <h2>Loading chat...</h2>
            <p>Please wait.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!chatUser) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="empty-box">
            <h2>Chat user not found</h2>

            <p>
              Please select a mentor or student
              first.
            </p>

            <button
              onClick={goBack}
              className="start-mentorship-btn"
            >
              ← Go Back
            </button>
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
          {user?.role === "mentor"
            ? "Mentor Panel"
            : "Student Panel"}
        </p>

        <nav>
          <a
            href={
              user?.role === "mentor"
                ? "/mentor-dashboard"
                : "/student-dashboard"
            }
          >
            🏠 Dashboard
          </a>

          {user?.role === "student" && (
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

          <a href="#" className="active">
            💬 Messages
          </a>

          <a href="#">
            💼 Jobs
          </a>

          <a href="#">
            🔔 Notifications
          </a>
        </nav>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </aside>

      {/* MAIN */}

      <main className="dashboard-main">

        <div className="dashboard-header">
          <div>
            <h1>
              💬{" "}
              {user?.role === "mentor"
                ? "Message Student"
                : "Message Mentor"}
            </h1>

            <p>
              Chat with {chatUser.name} and
              discuss career guidance.
            </p>
          </div>

          <button
            onClick={goBack}
            className="back-dashboard-btn"
          >
            ← Back
          </button>
        </div>

        {/* CHAT USER */}

        <section className="dashboard-section">

          <div className="mentor-mini-profile">

            <div className="profile-avatar">
              {chatUser.name
                ? chatUser.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div className="profile-info">

              <h2>
                {chatUser.name}
              </h2>

              <p>
                {chatUser.headline ||
                  (chatUser.role === "student"
                    ? "Student"
                    : "Professional Mentor")}
              </p>

              <div className="profile-details">
                <span>
                  👤 {chatUser.role}
                </span>

                <span>
                  📧 {chatUser.email}
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* CHAT */}

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>
                Chat with {chatUser.name}
              </h2>

              <p>
                Your messages are saved in
                CareerConnect.
              </p>
            </div>
          </div>

          {/* MESSAGE AREA */}

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
              minHeight: "350px",
              maxHeight: "450px",
              overflowY: "auto",
              background: "#f8fafc",
              marginBottom: "20px",
            }}
          >

            {messages.length === 0 ? (

              <div
                style={{
                  textAlign: "center",
                  padding: "100px 20px",
                }}
              >
                <div
                  style={{
                    fontSize: "45px",
                  }}
                >
                  💬
                </div>

                <h3>
                  No messages yet
                </h3>

                <p>
                  Start the conversation with{" "}
                  {chatUser.name}.
                </p>
              </div>

            ) : (

              messages.map((message) => {

                const isMine =
                  String(
                    message.sender?._id
                  ) === String(user?.id);

                return (
                  <div
                    key={message._id}
                    style={{
                      display: "flex",
                      justifyContent:
                        isMine
                          ? "flex-end"
                          : "flex-start",
                      marginBottom: "12px",
                    }}
                  >

                    <div
                      style={{
                        maxWidth: "70%",
                        padding:
                          "12px 16px",
                        borderRadius:
                          "12px",
                        background:
                          isMine
                            ? "#2563eb"
                            : "#ffffff",
                        color:
                          isMine
                            ? "#ffffff"
                            : "#111827",
                        border:
                          isMine
                            ? "none"
                            : "1px solid #ddd",
                      }}
                    >

                      <p
                        style={{
                          margin: 0,
                        }}
                      >
                        {message.message}
                      </p>

                      <small
                        style={{
                          display: "block",
                          marginTop: "5px",
                          opacity: 0.7,
                        }}
                      >
                        {new Date(
                          message.createdAt
                        ).toLocaleTimeString()}
                      </small>

                    </div>

                  </div>
                );
              })

            )}

          </div>

          {/* INPUT */}

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >

            <input
              type="text"
              placeholder={`Message ${chatUser.name}...`}
              value={newMessage}
              onChange={(e) =>
                setNewMessage(
                  e.target.value
                )
              }
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />

            <button
              type="button"
              onClick={sendMessage}
              className="start-mentorship-btn"
            >
              📤 Send
            </button>

          </div>

        </section>

      </main>
    </div>
  );
}

export default MessageMentor;