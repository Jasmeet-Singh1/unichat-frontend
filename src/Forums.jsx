import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const dummyPostsFromDB = [
  {
    id: 1,
    author: "👩‍🎓 Alice (CS 2025)",
    message: "Check out our new AI club meetup this Friday!",
    image: "/Convocation.png",
    comments: [
      {
        author: "Raj",
        text: "Sounds great! Where is it happening?",
        reply: "Room 203, Surrey Campus!",
      },
    ],
  },
  {
    id: 2,
    author: "👨‍🎓 John (BBA 2024)",
    message: "Any good resume templates for internship apps?",
    image: "",
    comments: [],
  },
];

const Forums = ({ role = "Student" }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Simulate fetching posts from DB
    setTimeout(() => setPosts(dummyPostsFromDB), 500);
  }, []);

  return (
    <>
      <style>
        {`
          .forums-container {
            font-family: 'Segoe UI', sans-serif;
            background: #f5f5f5;
            min-height: 100vh;
            padding: 32px;
            max-width: 960px;
            margin: 0 auto;
          }

          .header {
            background: linear-gradient(to right, #3A86FF, #6b46c1);
            color: white;
            padding: 24px;
            border-radius: 12px;
            margin-bottom: 24px;
            text-align: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }

          .create-post {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.08);
            margin-bottom: 40px;
          }

          .create-post textarea, .create-post input {
            width: 100%;
            padding: 10px;
            margin-top: 10px;
            border-radius: 6px;
            border: 1px solid #ccc;
            font-size: 14px;
          }

          .create-post button {
            background: #3A86FF;
            color: white;
            border: none;
            padding: 10px 20px;
            margin-top: 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
          }

          .forum-post {
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 24px;
            box-shadow: 0 6px 10px rgba(0,0,0,0.05);
          }

          .forum-img {
            margin-top: 12px;
            border-radius: 10px;
            width: 100%;
            max-height: 300px;
            object-fit: cover;
            box-shadow: 0 3px 6px rgba(0,0,0,0.08);
          }

          .forum-actions {
            display: flex;
            gap: 12px;
            margin-top: 16px;
          }

          .forum-actions button {
            background: #e0e7ff;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            font-weight: 600;
          }

          .comment {
            margin-top: 16px;
            padding-left: 16px;
            border-left: 3px solid #ccc;
            color: #333;
          }

          .reply {
            margin-top: 8px;
            margin-left: 20px;
            color: #666;
          }

          .add-comment {
            margin-top: 16px;
          }

          .add-comment input {
            width: 100%;
            padding: 8px;
            margin-top: 6px;
            border-radius: 5px;
            border: 1px solid #ccc;
          }

          .add-comment button {
            background-color: #3A86FF;
            color: white;
            padding: 8px 12px;
            border: none;
            margin-top: 6px;
            border-radius: 5px;
            cursor: pointer;
          }
        `}
      </style>

      <div className="forums-container">
        <motion.div
          className="create-post"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h3>📝 Create New Post</h3>
          <textarea rows="4" placeholder="Write or upload your post..." />
          <input type="text" placeholder="Optional image URL" />
          <button>Post</button>
        </motion.div>

        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            className="forum-post"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * (i + 1), duration: 0.4 }}
          >
            <p>
              <strong>{post.author}:</strong> {post.message}
            </p>
            {post.image && (
              <img src="./../../Convocation.png" className="forum-img" alt="Forum Visual" />
            )}

            <div className="forum-actions">
              <button>👍 Like</button>
              <button>💬 Comment</button>
              <button>⚠️ Report</button>
            </div>

            {post.comments.map((comment, idx) => (
              <div className="comment" key={idx}>
                <strong>{comment.author}:</strong> {comment.text}
                <div className="reply">
                  <strong>{post.author.split(" ")[0]}:</strong> {comment.reply}
                </div>
              </div>
            ))}

            <div className="add-comment">
              <input type="text" placeholder="Write a comment..." />
              <button>Post</button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default Forums;
