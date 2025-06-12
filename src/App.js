// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Home() {
  return <h2>🏠 Welcome to UniChat Home Page</h2>;
}

function Chat() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat Room</h2>
      <div style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px", height: "200px" }}>
        <p>[Message area placeholder]</p>
      </div>
      <input type="text" placeholder="Type your message..." style={{ width: "80%", marginRight: "10px" }} />
      <button>Send</button>
    </div>
  );
}

function Profile() {
  return <h2>👤 User Profile Page</h2>;
}

function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', background: '#f0f0f0' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        <Link to="/chat" style={{ marginRight: '10px' }}>Chat</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
