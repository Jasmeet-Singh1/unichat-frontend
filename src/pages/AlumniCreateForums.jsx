import React from "react";

const AlumniCreateForums = () => {
  const styles = {
    container: {
      backgroundColor: "#f4f4f4",
      padding: "10px 20px 20px",
      fontFamily: "Arial, sans-serif",
      maxWidth: "900px",
      margin: "0 auto",
    },
    backButton: {
      display: "inline-block",
      marginBottom: "25px",
      padding: "10px 18px",
      backgroundColor: "#3A86FF",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      textDecoration: "none",
      fontSize: "15px",
      cursor: "pointer",
    },
    newPost: {
      background: "#fff",
      padding: "20px",
      marginBottom: "30px",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginTop: "8px",
      marginBottom: "12px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "15px",
    },
    button: {
      backgroundColor: "#3A86FF",
      color: "#fff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "15px",
    },
    card: {
      background: "#fff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      marginBottom: "20px",
    },
    sectionTitle: {
      fontSize: "20px",
      marginBottom: "20px",
    },
    post: {
      borderLeft: "5px solid #3A86FF",
      paddingLeft: "15px",
      marginBottom: "25px",
    },
    postTitle: {
      margin: 0,
      color: "#333",
      fontSize: "18px",
    },
    postText: {
      margin: "5px 0",
      color: "#555",
    },
    postImage: {
      maxWidth: "100%",
      borderRadius: "5px",
      marginTop: "10px",
    },
    actions: {
      marginTop: "10px",
    },
    actionBtn: {
      backgroundColor: "#eee",
      border: "none",
      padding: "6px 12px",
      marginRight: "8px",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.container}>
      <a href="/forums" style={styles.backButton}>← Go Back to Forums</a>

      <div style={styles.newPost}>
        <h3>📝 Create a New Post</h3>
        <input type="text" placeholder="Post Title..." style={styles.input} />
        <textarea
          rows="4"
          placeholder="Share an idea, job opening, or insight..."
          style={styles.input}
        ></textarea>
        <input
          type="text"
          placeholder="Image/Job Link (optional)"
          style={styles.input}
        />
        <button style={styles.button}>Post</button>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>🔥 Latest Discussions</h3>

        <div style={styles.post}>
          <h4 style={styles.postTitle}>🚀 Internship Opportunity at TechNova</h4>
          <p style={styles.postText}>
            We are hiring final-year students for summer internship. Apply before July 5!
          </p>
          <a
            href="https://example.com/job-details"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply Here
          </a>
          <div style={styles.actions}>
            <button style={styles.actionBtn}>👍 Like (12)</button>
            <button style={styles.actionBtn}>💬 Reply</button>
          </div>
        </div>

        <div style={styles.post}>
          <h4 style={styles.postTitle}>💡 Tips for Balancing Work and Study</h4>
          <p style={styles.postText}>
            As someone who recently transitioned to full-time work, here are a few survival tricks that helped me during my studies...
          </p>
          <div style={styles.actions}>
            <button style={styles.actionBtn}>👍 Like (7)</button>
            <button style={styles.actionBtn}>💬 Reply</button>
          </div>
        </div>

        <div style={styles.post}>
          <h4 style={styles.postTitle}>📸 Alumni Meet Highlights</h4>
          <p style={styles.postText}>
            Here’s a glimpse of last weekend’s gathering! Great to reconnect!
          </p>
          <img
            src="https://via.placeholder.com/600x300"
            alt="Alumni Event"
            style={styles.postImage}
          />
          <div style={styles.actions}>
            <button style={styles.actionBtn}>👍 Like (22)</button>
            <button style={styles.actionBtn}>💬 Reply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniCreateForums;