import React from "react";

const Browse = ({ role }) => {
  const styles = {
    container: {
      backgroundColor: "#F5F7FA",
      padding: "30px 20px",
      maxWidth: "1000px",
      margin: "auto",
      fontFamily: "'Segoe UI', sans-serif",
    },
    section: {
      backgroundColor: "#FFFFFF",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.08)",
    },
    heading: {
      fontSize: "22px",
      color: "#222",
      marginBottom: "20px",
      fontWeight: "bold",
    },
    searchContainer: {
      marginBottom: "25px",
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
    },
    searchInput: {
      flex: "1",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "14px",
    },
    dropdown: {
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      backgroundColor: "#FFFFFF",
      fontSize: "14px",
      cursor: "pointer",
    },
    dropdownHover: {
      backgroundColor: "#F2F2F2",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#222",
      marginTop: "20px",
      marginBottom: "10px",
    },
    card: {
      backgroundColor: "#fcfcfc",
      border: "1px solid #ddd",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "15px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    infoBox: {
      maxWidth: "75%",
    },
    name: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#222",
    },
    meta: {
      fontSize: "13px",
      color: "#555",
      marginTop: "5px",
    },
    button: {
      backgroundColor: "#3A86FF",
      color: "#fff",
      padding: "8px 14px",
      border: "none",
      borderRadius: "4px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    courseBox: {
      backgroundColor: "#f9f9f9",
      padding: "10px 15px",
      borderRadius: "6px",
      border: "1px solid #eee",
      marginBottom: "10px",
      fontSize: "14px",
    },
    clubItem: {
      backgroundColor: "#f9f9f9",
      padding: "10px 15px",
      borderRadius: "6px",
      border: "1px solid #eee",
      marginBottom: "10px",
      fontSize: "14px",
    },
    infoText: {
      color: "#555",
      fontSize: "13px",
      marginTop: "5px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        {role === "Student" ? (
          <>
            <div style={styles.heading}>🔍 Search Campus Community</div>
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search by name or keyword"
                style={styles.searchInput}
              />
              <select style={styles.dropdown}>
                <option>Program</option>
              </select>
              <select style={styles.dropdown}>
                <option>Year</option>
              </select>
              <select style={styles.dropdown}>
                <option>Role</option>
              </select>
            </div>

            <div style={styles.sectionTitle}>👥 Top Results</div>

            <div style={styles.card}>
              <div style={styles.infoBox}>
                <div style={styles.name}>🎓 Emily Watson</div>
                <div style={styles.meta}>
                  Student | BBA | 2025 | Interests: Marketing, Startups
                </div>
              </div>
              <button style={styles.button}>Send Message</button>
            </div>

            <div style={styles.card}>
              <div style={styles.infoBox}>
                <div style={styles.name}>👨‍🏫 Prof. Ali</div>
                <div style={styles.meta}>
                  Mentor | KPU Mentor Program | 2024 | Topics: Web Dev, Career
                  Guidance
                </div>
              </div>
              <button style={styles.button}>Send Message</button>
            </div>

            <div style={styles.card}>
              <div style={styles.infoBox}>
                <div style={styles.name}>🎓 John Smith</div>
                <div style={styles.meta}>
                  Alumni | BSc Computer Science | 2022 | Interests: AI, Cloud
                  Computing
                </div>
              </div>
              <button style={styles.button}>Send Message</button>
            </div>
          </>
        ) : (
          <>
            <div style={styles.heading}>
              🔎 Browse Students Looking for Mentorship
            </div>

            <div style={styles.card}>
              <div style={styles.infoBox}>
                <div style={styles.name}>👩‍🎓 Jasleen Kaur</div>
                <div style={styles.meta}>
                  BSc Computer Science | Year: 2025 | Interests: Web Dev,
                  Internships
                </div>
              </div>
              <button style={styles.button}>📩 Send Message</button>
            </div>

            <div style={styles.card}>
              <div style={styles.infoBox}>
                <div style={styles.name}>👨‍🎓 Harsh Mehta</div>
                <div style={styles.meta}>
                  BBA Marketing | Year: 2024 | Interests: Branding, Startups
                </div>
              </div>
              <button style={styles.button}>📩 Send Message</button>
            </div>

            <div style={styles.card}>
              <div style={styles.infoBox}>
                <div style={styles.name}>👩‍🎓 Mandeep Singh</div>
                <div style={styles.meta}>
                  BA Psychology | Year: 2026 | Interests: Counseling, Student
                  Life
                </div>
              </div>
              <button style={styles.button}>📩 Send Message</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Browse;
