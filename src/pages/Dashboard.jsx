import React from 'react';

const Dashboard = ({ role }) => {
  const styles = {
    container: {
      backgroundColor: '#F5F7FA',
      padding: '30px 20px',
      maxWidth: '1000px',
      margin: 'auto',
      fontFamily: "'Segoe UI', sans-serif",
    },
    section: {
      backgroundColor: '#FFFFFF',
      padding: '20px',
      marginBottom: '25px',
      borderRadius: '8px',
      boxShadow: '0 0 5px rgba(0,0,0,0.1)',
    },
    heading: {
      marginTop: 0,
      color: '#222',
    },
    paragraph: {
      color: '#555',
      fontSize: '15px',
    },
    listItem: {
      marginBottom: '10px',
      color: '#555',
      fontSize: '14px',
    },
    bold: {
      fontWeight: 'bold',
    },
    image: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '6px',
    },
    actions: {
      marginTop: '10px',
    },
    button: {
      marginRight: '10px',
      padding: '8px 12px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    blueButton: {
      backgroundColor: '#3A86FF',
      color: 'white',
    },
    redButton: {
      backgroundColor: '#FF595E',
      color: 'white',
    },
  };

  return (
    <div style={styles.container}>
      {role === 'Student' ? (
        <>
          <div style={styles.section}>
            <h2 style={styles.heading}>👋 Welcome {role}!</h2>
            <p style={styles.paragraph}>This is your personalized dashboard. Here’s what you can do today:</p>
            <ul>
              <li style={styles.listItem}>🔍 Browse and connect with students, alumni or mentors</li>
              <li style={styles.listItem}>💬 Chat with friends or create group discussions</li>
              <li style={styles.listItem}>📢 Engage in campus forums and stay updated</li>
              <li style={styles.listItem}>👤 Update your profile and academic interests</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h2 style={styles.heading}><a href='/forums'>📢 Campus Forums</a></h2>
            <div>
              <p style={styles.paragraph}>
                <strong>Alice (CS 2025):</strong> Check out our new AI club meetup this Friday!
              </p>
              <img src='forum-pic.jpg' alt='AI Meetup Poster' style={styles.image} />
              <div style={styles.actions}>
                <button style={{ ...styles.button, ...styles.blueButton }}>👍 Like</button>
                <button style={{ ...styles.button, ...styles.blueButton }}>💬 Comment</button>
                <button style={{ ...styles.button, ...styles.redButton }}>⚠️ Report</button>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.heading}><a href='/chat'>📩 Messages</a></h2>
            <p style={styles.paragraph}>You have no new messages. Start chatting with students or mentors!</p>
          </div>
        </>
      ) : (
        <>
          <div style={styles.section}>
            <h2 style={styles.heading}>👋 Welcome, Mentor!</h2>
            <p style={styles.paragraph}>
              This is your personalized mentor dashboard. Here’s what you can do today:
            </p>
            <ul>
              <li style={styles.listItem}>📬 View mentorship requests from students</li>
              <li style={styles.listItem}>💬 Chat with mentees</li>
              <li style={styles.listItem}>📢 Participate in academic and career forums</li>
              <li style={styles.listItem}>👤 Manage your profile and availability</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h2 style={styles.heading}>📬 Recent Requests</h2>
            <p style={styles.paragraph}>You have 2 new mentorship requests:</p>
            <ul>
              <li style={styles.listItem}>👩‍🎓 Amanpreet (BSc CS 2025) - Wants help with resume review</li>
              <li style={styles.listItem}>👨‍🎓 Raj (BBA 2024) - Interested in marketing guidance</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h2 style={styles.heading}>📌 Quick Tips</h2>
            <p style={styles.paragraph}>
              💡 Responding timely and updating your availability improves your mentor score!
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
