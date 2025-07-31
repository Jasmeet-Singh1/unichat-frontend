import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const requestsFromDB = [
  {
    id: 1,
    name: "Rajwinder Kaur",
    program: "BSc Computer Science",
    year: "2025",
    message:
      "Hi, I’m looking for guidance on preparing for co-op and interviews. Would love to connect!",
  },
  {
    id: 2,
    name: "Emily Watson",
    program: "BBA Marketing",
    year: "2024",
    message:
      "I'd like mentorship support for starting a LinkedIn presence and getting into marketing internships.",
  },
];

const MentorRequest = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setRequests(requestsFromDB);
    }, 500);
  }, []);

  const filtered = requests.filter((req) =>
    req.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        .mentor-container {
          max-width: 950px;
          margin: 30px auto;
          background-color: #fff;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        .mentor-title {
          font-size: 24px;
          color: #222;
          border-bottom: 2px solid #eee;
          padding-bottom: 8px;
          margin-bottom: 20px;
        }

        .mentor-search {
          margin-bottom: 20px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          width: 100%;
        }

        .request-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          background: #f5f7fa;
        }

        .request-card h3 {
          margin: 0 0 5px;
          color: #3A86FF;
        }

        .request-meta {
          font-size: 13px;
          color: #555;
          margin-bottom: 10px;
        }

        .request-message {
          margin-bottom: 15px;
          color: #222;
        }

        .request-actions button {
          padding: 8px 12px;
          font-size: 13px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 10px;
          background-color: #3A86FF;
          color: white;
          transition: transform 0.2s ease;
        }

        .request-actions button:hover {
          transform: scale(1.05);
          background-color: #2c3e50;
        }

        .no-results {
          color: #777;
          text-align: center;
          margin-top: 30px;
        }
      `}</style>

      <motion.div
        className="mentor-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mentor-title">📩 Mentorship Requests</h2>

        <input
          className="mentor-search"
          type="text"
          placeholder="🔍 Search by student name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filtered.length > 0 ? (
          filtered.map((req) => (
            <motion.div
              key={req.id}
              className="request-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3>{req.name}</h3>
              <div className="request-meta">
                Student | {req.program} | {req.year}
              </div>
              <div className="request-message">{req.message}</div>
              <div className="request-actions">
                <button>✅ Accept</button>
                <button style={{ backgroundColor: "#FF595E" }}>
                  ❌ Decline
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="no-results">No mentorship requests found.</div>
        )}
      </motion.div>
    </>
  );
};

export default MentorRequest;
