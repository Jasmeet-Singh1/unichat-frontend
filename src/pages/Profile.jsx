import React, { useState } from "react";

const Profile = ({ role }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    program: "",
    year: "",
    interests: "",
    bio: "",
    expertise: "",
    experience: "",
    topics: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const styles = {
    container: {
      maxWidth: "850px",
      margin: "30px auto",
      backgroundColor: "#FFFFFF",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#222",
      background: "#F5F7FA",
    },
    heading: {
      color: "#222",
      borderBottom: "2px solid #eee",
      paddingBottom: "5px",
      marginBottom: "20px",
    },
    label: {
      fontWeight: "bold",
      display: "block",
      margin: "15px 0 5px",
      color: "#555",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "14px",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "14px",
      resize: "vertical",
      marginBottom: "15px",
    },
    select: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "14px",
    },
    button: {
      marginTop: "20px",
      padding: "10px 20px",
      fontWeight: "bold",
      backgroundColor: "#3A86FF",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        👤 Edit Your {role === "Mentor" ? "Mentor" : "Student"} Profile
      </h2>
      <form>
        <label htmlFor="fullname" style={styles.label}>
          Full Name
        </label>
        <input
          type="text"
          id="fullname"
          value={formData.fullname}
          onChange={handleChange}
          placeholder="Enter your full name"
          style={styles.input}
        />

        <label htmlFor="email" style={styles.label}>
          University Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@kpu.ca"
          style={styles.input}
        />

        {role === "Mentor" ? (
          <>
            <label htmlFor="expertise" style={styles.label}>
              Area of Expertise
            </label>
            <input
              type="text"
              id="expertise"
              value={formData.expertise}
              onChange={handleChange}
              placeholder="e.g., Web Development, Resume Building"
              style={styles.input}
            />

            <label htmlFor="experience" style={styles.label}>
              Years of Experience
            </label>
            <select
              id="experience"
              value={formData.experience}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Select Years</option>
              <option>1-2</option>
              <option>3-5</option>
              <option>6-10</option>
              <option>10+</option>
            </select>

            <label htmlFor="topics" style={styles.label}>
              Topics You Mentor In
            </label>
            <input
              type="text"
              id="topics"
              value={formData.topics}
              onChange={handleChange}
              placeholder="e.g., Internships, Tech Careers"
              style={styles.input}
            />

            <label htmlFor="bio" style={styles.label}>
              Short Bio
            </label>
            <textarea
              id="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a short description about your mentorship experience..."
              style={styles.textarea}
            ></textarea>
          </>
        ) : (
          <>
            <label htmlFor="program" style={styles.label}>
              Program
            </label>
            <input
              type="text"
              id="program"
              value={formData.program}
              onChange={handleChange}
              placeholder="e.g., BBA - Marketing"
              style={styles.input}
            />

            <label htmlFor="year" style={styles.label}>
              Graduation Year
            </label>
            <select
              id="year"
              value={formData.year}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Select Year</option>
              <option>Not graduated</option>
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
            </select>

            <label htmlFor="interests" style={styles.label}>
              Your Interests
            </label>
            <input
              type="text"
              id="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="e.g., Data Science, UI/UX, Mentorship"
              style={styles.input}
            />

            <label htmlFor="bio" style={styles.label}>
              Short Bio
            </label>
            <textarea
              id="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us something about yourself..."
              style={styles.textarea}
            ></textarea>
          </>
        )}

        <button type="submit" style={styles.button}>
          💾 Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
