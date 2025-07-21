import React from "react";

const AlumniViewEvents = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.header}>📅 Upcoming Alumni Events</h3>

        <div style={styles.event}>
          <h4 style={styles.eventTitle}>🎉 Alumni Networking Night</h4>
          <p style={styles.eventDetails}>
            Date: July 15, 2025 | KPU Surrey Campus | 6:00 PM - 9:00 PM
          </p>
        </div>

        <div style={styles.event}>
          <h4 style={styles.eventTitle}>💻 Virtual Mentorship Bootcamp</h4>
          <p style={styles.eventDetails}>
            Date: August 10, 2025 | Online | 5:00 PM - 7:00 PM
          </p>
        </div>

        <div style={styles.event}>
          <h4 style={styles.eventTitle}>🏢 Career Fair & Employer Meet</h4>
          <p style={styles.eventDetails}>
            Date: September 5, 2025 | KPU Richmond | 11:00 AM - 4:00 PM
          </p>
        </div>

        <div style={styles.event}>
          <h4 style={styles.eventTitle}>
            🎓 Life After Graduation - Alumni Panel
          </h4>
          <p style={styles.eventDetails}>
            Date: October 12, 2025 | Zoom | 1:00 PM - 2:30 PM
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#F5F7FA",
    padding: "40px 20px",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    maxWidth: "700px",
    width: "100%",
  },
  header: {
    color: "#222",
    marginBottom: "25px",
    fontSize: "24px",
  },
  event: {
    marginBottom: "24px",
    borderLeft: "5px solid #2C3E50",
    paddingLeft: "15px",
  },
  eventTitle: {
    margin: 0,
    color: "#3A86FF",
    fontSize: "18px",
  },
  eventDetails: {
    marginTop: "6px",
    color: "#555",
    fontSize: "15px",
  },
};

export default AlumniViewEvents;
