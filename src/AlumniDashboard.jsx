import React from "react";

const AlumniDashboard = () => {
  const styles = {
    page: {
      backgroundColor: "#F5F7FA",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "40px 20px",
      maxWidth: "800px",
      margin: "auto",
    },
    card: {
      backgroundColor: "#FFFFFF",
      padding: "25px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      marginBottom: "30px",
    },
    title: {
      fontSize: "24px",
      color: "#222",
      marginBottom: "10px",
    },
    text: {
      fontSize: "16px",
      color: "#555",
    },
    listItem: {
      fontSize: "16px",
      color: "#555",
      marginBottom: "8px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
      color: "#555",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    button: {
      backgroundColor: "#3A86FF",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    buttonHover: {
      backgroundColor: "#2C6ED5",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back, Alumni!</h2>
        <p style={styles.text}>
          Stay connected with your university community, support students, and
          access exclusive alumni events and updates.
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Quick Links</h2>
        <ul style={{ paddingLeft: "20px" }}>
          <li style={styles.listItem}>🎓 Become a Mentor</li>
          <li style={styles.listItem}>📢 Post a job or internship on Forums</li>
          <li style={styles.listItem}>📅 View Upcoming Events</li>
        </ul>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Graduation Verification</h2>
        <form>
          <label htmlFor="gradYear" style={styles.label}>
            Graduation Year
          </label>
          <input
            type="number"
            id="gradYear"
            name="gradYear"
            placeholder="e.g. 2023"
            min="1900"
            max="2099"
            required
            style={styles.input}
          />

          <label htmlFor="proof" style={styles.label}>
            Upload Proof of Graduation
          </label>
          <input
            type="file"
            id="proof"
            name="proof"
            accept=".pdf, image/*"
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Submit Proof
          </button>
        </form>
      </div>
    </div>
  );
};

export default AlumniDashboard;
