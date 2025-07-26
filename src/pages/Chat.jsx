import React, { useState } from "react";

const Chat = ({ role = "mentor" }) => {
  const [message, setMessage] = useState("");
  const isMentor = role === "mentor";

  const handleSend = () => {
    if (message.trim()) {
      // Message send logic goes here
      setMessage("");
    }
  };

  const chatData = isMentor
    ? {
        headerName: "Rajwinder Kaur",
        messages: [
          { text: "Hello Mentor!", type: "received", time: "10:00 AM" },
          {
            text: "Hi Rajwinder! How can I help?",
            type: "sent",
            time: "10:01 AM ✓✓",
          },
        ],
        chatList: [
          { name: "Rajwinder Kaur", last: "Thank you!" },
          { name: "Jason Miller", last: "Will join the session." },
        ],
      }
    : {
        headerName: "Emily Watson",
        messages: [
          { text: "Hi Emily!", type: "received", time: "10:00 AM" },
          {
            text: "Hey there! How are you?",
            type: "sent",
            time: "10:01 AM ✓✓",
          },
          {
            text: "Can I ask about career paths?",
            type: "sent",
            time: "10:02 AM ✓",
          },
          { text: "Of course! Ask away.", type: "received", time: "10:03 AM" },
        ],
        chatList: [
          { name: "Emily Watson", last: "Hey, thanks!" },
          { name: "John Carter", last: "Sure, I'll help!" },
          { name: "Prof. Ali", last: "Send me your resume." },
        ],
      };

  return (
    <div style={styles.container}>
      <div style={styles.chatList}>
        <div style={styles.chatListHeader}>
          {isMentor ? "💬 CHATS" : "💬 PERSONAL CHATS"}
        </div>
        {chatData.chatList.map((chat, idx) => (
          <div key={idx} style={styles.chatItem}>
            <strong>{chat.name}</strong>
            <br />
            <small style={{ color: "#555" }}>Last message: {chat.last}</small>
          </div>
        ))}
        <div style={styles.addChatBtn}>➕ Start New Chat</div>
        {!isMentor && <div style={styles.createGroupBtn}>👥 Create Group</div>}
      </div>

      <div style={styles.chatBox}>
        <div style={styles.chatHeader}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="avatar.jpg"
              alt="Profile"
              style={{ height: "40px", borderRadius: "50%" }}
            />
            <span style={styles.headerName}>{chatData.headerName}</span>
          </div>
        </div>

        <div style={styles.messages}>
          {chatData.messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                ...(msg.type === "sent" ? styles.sent : styles.received),
              }}
            >
              {msg.text}
              <div style={styles.timestamp}>{msg.time}</div>
            </div>
          ))}
        </div>

        <div style={styles.inputArea}>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.input}
          />
          <button style={styles.sendBtn} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "85vh",
    backgroundColor: "#F5F7FA",
    fontFamily: "'Segoe UI', sans-serif",
  },
  chatList: {
    width: "25%",
    backgroundColor: "#fff",
    borderRight: "1px solid #ddd",
    overflowY: "auto",
  },
  chatListHeader: {
    backgroundColor: "#2C3E50",
    color: "white",
    padding: "10px",
    fontWeight: "bold",
    fontSize: "16px",
    textAlign: "center",
  },
  chatItem: {
    padding: "15px",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  },
  addChatBtn: {
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#F2F2F2",
    fontWeight: "bold",
    cursor: "pointer",
    borderTop: "1px solid #ccc",
  },
  createGroupBtn: {
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#F2F2F2",
    fontWeight: "bold",
    cursor: "pointer",
    borderTop: "1px solid #ccc",
  },
  chatBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #ccc",
  },
  headerName: {
    fontWeight: "bold",
    marginLeft: "10px",
    color: "#222",
  },
  messages: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    backgroundColor: "#E9E9E9",
  },
  message: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "70%",
    wordBreak: "break-word",
  },
  sent: {
    backgroundColor: "#d1e7dd",
    alignSelf: "flex-end",
  },
  received: {
    backgroundColor: "#f8d7da",
    alignSelf: "flex-start",
  },
  timestamp: {
    fontSize: "11px",
    color: "#555",
    marginTop: "5px",
  },
  inputArea: {
    display: "flex",
    padding: "10px",
    backgroundColor: "#fff",
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  sendBtn: {
    marginLeft: "10px",
    padding: "10px 15px",
    backgroundColor: "#3A86FF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Chat;
