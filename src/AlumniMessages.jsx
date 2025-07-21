import React, { useState } from "react";

const AlumniMessages = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const messages = [
    {
      id: 1,
      sender: "Alice Johnson",
      subject: "Mentorship Follow-up",
      date: "2025-06-22",
      body: "Hi, I wanted to thank you for accepting my mentorship request. Looking forward to working together!",
    },
    {
      id: 2,
      sender: "Mark Twain",
      subject: "Job Opportunity in Marketing",
      date: "2025-06-20",
      body: "Hello! There's an opening at my company for a marketing intern. Let me know if you're interested or want more details.",
    },
    {
      id: 3,
      sender: "Emily Clark",
      subject: "Upcoming Alumni Event",
      date: "2025-06-18",
      body: "Dear Alumni, we are excited to invite you to our upcoming networking event. Please RSVP by July 5th.",
    },
    {
      id: 4,
      sender: "Bob Lee",
      subject: "Project Collaboration",
      date: "2025-06-15",
      body: "Would you be interested in collaborating on a project related to project management? Let me know your thoughts.",
    },
  ];

  const selectedMessage = messages.find((msg) => msg.id === selectedId);

  const handleSendReply = () => {
    if (replyText.trim() === "") {
      alert("Please enter a reply before sending.");
      return;
    }
    alert(`Reply sent:\n\n${replyText}`);
    setReplyText("");
  };

  return (
    <main style={styles.main}>
      <section style={styles.listSection}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            onClick={() => setSelectedId(msg.id)}
            style={{
              ...styles.messageItem,
              backgroundColor:
                selectedId === msg.id ? "#F2F2F2" : "transparent",
            }}
          >
            <div style={styles.subject}>{msg.subject}</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={styles.sender}>{msg.sender}</span>
              <span style={styles.date}>{msg.date}</span>
            </div>
            <div style={styles.preview}>
              {msg.body.length > 60
                ? msg.body.substring(0, 60) + "..."
                : msg.body}
            </div>
          </div>
        ))}
      </section>

      <section style={styles.detailSection}>
        {selectedMessage ? (
          <>
            <div>
              <h3>{selectedMessage.subject}</h3>
              <p style={styles.from}>
                From: {selectedMessage.sender} | Date: {selectedMessage.date}
              </p>
              <div style={styles.body}>{selectedMessage.body}</div>
            </div>

            <div style={styles.replySection}>
              <label htmlFor="reply">Reply:</label>
              <textarea
                id="reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                style={styles.textarea}
              />
              <button onClick={handleSendReply} style={styles.sendBtn}>
                Send
              </button>
            </div>
          </>
        ) : (
          <p style={styles.noMessage}>Select a message to view its content.</p>
        )}
      </section>
    </main>
  );
};

const styles = {
  main: {
    display: "flex",
    gap: "30px",
    padding: "160px 30px 30px",
    fontFamily: "Arial, sans-serif",
    background: "#F5F7FA",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  listSection: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "35%",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    overflowY: "auto",
    maxHeight: "80vh",
  },
  messageItem: {
    borderBottom: "1px solid #ddd",
    padding: "12px 8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  subject: {
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "5px",
  },
  sender: {
    color: "#555",
    fontSize: "14px",
  },
  date: {
    fontSize: "12px",
    color: "#999",
  },
  preview: {
    color: "#666",
    fontSize: "13px",
    marginTop: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  detailSection: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    flexGrow: 1,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    maxHeight: "80vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  from: {
    color: "#555",
    marginBottom: "20px",
    fontStyle: "italic",
  },
  body: {
    flexGrow: 1,
    whiteSpace: "pre-wrap",
    fontSize: "15px",
    lineHeight: 1.5,
    marginBottom: "20px",
  },
  replySection: {
    marginTop: "20px",
    backgroundColor: "#2C3E50",
    color: "#eee",
    padding: "15px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
  },
  textarea: {
    backgroundColor: "#333",
    color: "#eee",
    border: "none",
    borderRadius: "5px",
    padding: "10px",
    resize: "vertical",
    minHeight: "80px",
    fontSize: "14px",
    marginBottom: "10px",
    fontFamily: "Arial, sans-serif",
  },
  sendBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#3A86FF",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s",
  },
  noMessage: {
    fontStyle: "italic",
    color: "#777",
    textAlign: "center",
    marginTop: "50px",
    flexGrow: 1,
  },
};

export default AlumniMessages;
