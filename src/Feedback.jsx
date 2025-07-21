import React, { useState } from "react";

const Feedback = ({ role = "mentor" }) => {
  const [experience, setExperience] = useState("");
  const [comments, setComments] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submission logic here (can be adapted to API call)
    alert(`Feedback submitted!`);
  };

  const styles = {
    page: {
      backgroundColor: "#F5F7FA",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', sans-serif",
      maxWidth: "800px",
      margin: "auto",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.08)",
      padding: "30px",
    },
    title: {
      fontSize: "24px",
      color: "#222",
      marginBottom: "25px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
      color: "#555",
    },
    select: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      marginBottom: "20px",
      backgroundColor: "#FFFFFF",
    },
    textarea: {
      width: "100%",
      height: "120px",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      marginBottom: "20px",
      resize: "vertical",
      fontSize: "14px",
    },
    checkboxContainer: {
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
    },
    checkbox: {
      marginRight: "10px",
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
    subtitle: {
      fontSize: "16px",
      color: "#555",
      marginBottom: "10px",
    },
  };

  const studentView = (
    <div style={styles.card}>
      <h2 style={styles.title}>✍️ Share Your Feedback</h2>
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>How was your UniChat experience?</label>
        <select
          style={styles.select}
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <option value="">Select...</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Okay">Okay</option>
          <option value="Poor">Poor</option>
        </select>

        <label style={styles.label}>Comments or Suggestions</label>
        <textarea
          style={styles.textarea}
          placeholder="Share your thoughts..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />

        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="anon"
            style={styles.checkbox}
            checked={anonymous}
            onChange={() => setAnonymous(!anonymous)}
          />
          <label htmlFor="anon">Submit anonymously</label>
        </div>

        <button type="submit" style={styles.button}>
          📤 Submit Feedback
        </button>
      </form>
    </div>
  );

  const mentorView = (
    <div style={styles.card}>
      <h2 style={styles.title}>📊 Mentor Feedback Form</h2>
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>
          How helpful were the student conversations?
        </label>
        <select
          style={styles.select}
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <option value="">Select...</option>
          <option value="Very Helpful">Very Helpful</option>
          <option value="Somewhat Helpful">Somewhat Helpful</option>
          <option value="Not Helpful">Not Helpful</option>
        </select>

        <label style={styles.label}>Mentorship Feedback</label>
        <textarea
          style={styles.textarea}
          placeholder="Share suggestions or concerns..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />

        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="anon"
            style={styles.checkbox}
            checked={anonymous}
            onChange={() => setAnonymous(!anonymous)}
          />
          <label htmlFor="anon">Submit anonymously</label>
        </div>

        <button type="submit" style={styles.button}>
          📤 Submit Feedback
        </button>
      </form>
    </div>
  );

  return (
    <div style={styles.page}>
      {role === "student" ? studentView : mentorView}
    </div>
  );
};

export default Feedback;
