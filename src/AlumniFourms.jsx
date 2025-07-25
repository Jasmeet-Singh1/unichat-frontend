import React from 'react';

const AlumniForums = () => {
    return (
        <>
            <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          background-color: #F5F7FA;
          font-family: Arial, sans-serif;
          margin: 0;
        }
        main {
          padding: 40px 30px;
          max-width: 900px;
          margin: 0 auto;
        }
        .create-post {
          display: inline-block;
          margin-bottom: 25px;
          padding: 12px 24px;
          background-color: #3A86FF;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 17px;
          cursor: pointer;
          text-decoration: none;
        }
        .card {
          background: #fff;
          padding: 25px;
          margin-bottom: 25px;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .card h3 {
          margin-top: 0;
          font-size: 22px;
          color: #222;
        }
        .card p {
          font-size: 16px;
          color: #555;
        }
        .card img {
          max-width: 100%;
          border-radius: 6px;
          margin-top: 10px;
        }
        .tags {
          color: #555;
          font-size: 14px;
          margin-top: 10px;
        }
        .actions {
          margin-top: 15px;
        }
        .actions button {
          margin-right: 10px;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          color: #fff;
        }
        .like-btn {
          background-color: #3A86FF;
        }
        .reply-btn {
          background-color: #3A86FF;
        }
        .report-btn {
          background-color: #FF595E;
        }
      `}</style>

            <main>
                <a className="create-post" href="/createforums">+ Create New Post</a>

                <div className="card">
                    <h3>Hiring Software Interns - Summer 2025</h3>
                    <p>🚀 We're hiring 2 paid interns for our DevOps team in Vancouver. Apply before July 15th.</p>
                    <div className="tags">Posted by AliceW | 🧑‍💼 Alumni | 💼 Job Opportunity</div>
                    <div className="actions">
                        <button className="like-btn">👍 Like</button>
                        <button className="reply-btn">💬 Reply</button>
                        <button className="report-btn">⚠️ Report</button>
                    </div>
                </div>

                <div className="card">
                    <h3>Throwback to Our Convocation Ceremony!</h3>
                    <p>So proud to be part of the Class of 2024! 🎓</p>
                    <img src="./../../Convocation.png" alt="Convocation" />
                    <div className="tags">Posted by Sam22 | 📷 Alumni | 📸 Photo</div>
                    <div className="actions">
                        <button className="like-btn">👍 Like</button>
                        <button className="reply-btn">💬 Reply</button>
                        <button className="report-btn">⚠️ Report</button>
                    </div>
                </div>

                <div className="card">
                    <h3>Best Interview Prep Resources?</h3>
                    <p>Hi folks, I’m preparing for a business analyst interview at Deloitte. Any resources you'd recommend?</p>
                    <div className="tags">Posted by JayK | ❓ Question | 🎯 Career Advice</div>
                    <div className="actions">
                        <button className="like-btn">👍 Like</button>
                        <button className="reply-btn">💬 Reply</button>
                        <button className="report-btn">⚠️ Report</button>
                    </div>
                </div>
            </main>
        </>
    );
};

export default AlumniForums;
