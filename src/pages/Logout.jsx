import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

const Logout = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Clear storage
    localStorage.removeItem("user");

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    // Redirect after 2s
    const timer = setTimeout(() => {
      setShowConfetti(false);
      navigate("/login");
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div style={styles.container}>
      {showConfetti && <Confetti numberOfPieces={150} recycle={false} />}
      <motion.div
        style={styles.messageBox}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          style={styles.tick}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          ✅
        </motion.div>
        <motion.h2
          style={styles.title}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Logged out successfully!
        </motion.h2>
        <motion.p
          style={styles.text}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Redirecting to login page...
        </motion.p>

        <div style={styles.progressBarContainer}>
          <motion.div
            style={{ ...styles.progressBar, width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#f2f5f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    margin: 0,
    overflow: "hidden",
  },
  messageBox: {
    textAlign: "center",
    padding: "50px",
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
    border: "2px solid #e6ecf1",
    maxWidth: "400px",
    position: "relative",
    zIndex: 2,
  },
  tick: {
    fontSize: "60px",
    color: "#28a745",
    marginBottom: "10px",
    filter: "drop-shadow(0 0 5px #90ee90)",
  },
  title: {
    fontSize: "24px",
    color: "#222",
    marginBottom: "10px",
    fontWeight: "600",
  },
  text: {
    fontSize: "15px",
    color: "#666",
  },
  progressBarContainer: {
    marginTop: "25px",
    height: "10px",
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: "5px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#28a745",
    borderRadius: "5px",
    transition: "width 0.3s ease-in-out",
  },
};

export default Logout;
