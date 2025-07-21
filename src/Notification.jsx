import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          user: "Emily Watson",
          course: "Data Structures",
          time: "2 mins ago",
        },
        {
          id: 2,
          user: "John Carter",
          course: "Web Development",
          time: "10 mins ago",
        },
        {
          id: 3,
          user: "Sarah Lee",
          course: "Machine Learning",
          time: "1 hour ago",
        },
        {
          id: 4,
          user: "Michael Tran",
          course: "Database Systems",
          time: "2 hours ago",
        },
      ]);
    }, 800);
  }, []);

  return (
    <>
      <style>
        {`
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #F5F7FA;
          margin: 0;
        }

        .notification-page {
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.05);
        }

        .notification-page h2 {
          margin-top: 0;
          color: #3A86FF;
          font-size: 1.8rem;
        }

        .notification {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px;
          border-bottom: 1px solid #eee;
        }

        .notification-text {
          font-size: 15px;
          color: #222;
        }

        .notification-time {
          font-size: 13px;
          color: #777;
        }

        .footer {
          text-align: center;
          padding: 20px;
          background-color: #ECECEC;
          color: #777;
          font-size: 13px;
          margin-top: 40px;
        }
      `}
      </style>

      <motion.div
        className="notification-page"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2>🔔 Notifications</h2>

        {notifications.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading notifications...
          </motion.p>
        ) : (
          notifications.map((note, index) => (
            <motion.div
              key={note.id}
              className="notification"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="notification-text">
                🎉 <strong>{note.user}</strong> joined your course:{" "}
                <strong>{note.course}</strong>
              </div>
              <div className="notification-time">{note.time}</div>
            </motion.div>
          ))
        )}
      </motion.div>

      <div className="footer">
        © 2025 UniChat - Designed for KPU Students & Alumni
      </div>
    </>
  );
};

export default Notification;
