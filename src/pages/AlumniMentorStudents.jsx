import React, { useState } from "react";

const AlumniMentorStudent = () => {
  const [searchName, setSearchName] = useState("");
  const [searchProgram, setSearchProgram] = useState("");
  const [searchInterest, setSearchInterest] = useState("");
  const [requests, setRequests] = useState([
    { name: "Alice Johnson", program: "Engineering", date: "2025-06-22" },
    { name: "Bob Lee", program: "Psychology", date: "2025-06-24" },
  ]);

  const mentees = [
    {
      name: "Jane Doe",
      program: "Computer Science",
      interests: "AI, Cybersecurity",
      email: "jane.doe@kpu.com",
    },
    {
      name: "Mark Twain",
      program: "Business",
      interests: "Marketing, Project Management",
      email: "mark.twain@kpu.com",
    },
    {
      name: "Alice Johnson",
      program: "Engineering",
      interests: "Software Development",
      email: "alice.johnson@kpu.com",
    },
    {
      name: "Bob Lee",
      program: "Psychology",
      interests: "Project Management",
      email: "bob.lee@kpu.com",
    },
    {
      name: "Emily Clark",
      program: "Nursing",
      interests: "Healthcare, AI",
      email: "emily.clark@kpu.com",
    },
  ];

  const acceptedMentees = [
    {
      name: "Jane Doe",
      program: "Computer Science",
      lastContact: "2025-06-20",
    },
    { name: "Mark Twain", program: "Business", lastContact: "2025-06-15" },
  ];

  const filteredMentees = mentees.filter((mentee) => {
    const nameMatch = mentee.name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const programMatch = searchProgram
      ? mentee.program === searchProgram
      : true;
    const interestMatch = searchInterest
      ? mentee.interests.includes(searchInterest)
      : true;
    return nameMatch && programMatch && interestMatch;
  });

  const handleRequest = (index, accepted) => {
    const name = requests[index].name;
    alert(
      `${accepted ? "Accepted" : "Declined"} mentorship request from ${name}.`
    );
    setRequests((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main
      style={{
        padding: "160px 30px 30px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section style={sectionStyle}>
        <h3>Browse Mentees</h3>
        <div>
          <label style={labelStyle}>Search by Name:</label>
          <input
            type="text"
            placeholder="Enter mentee name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Filter by Program:</label>
          <select
            value={searchProgram}
            onChange={(e) => setSearchProgram(e.target.value)}
            style={inputStyle}
          >
            <option value="">All Programs</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Business">Business</option>
            <option value="Engineering">Engineering</option>
            <option value="Psychology">Psychology</option>
            <option value="Nursing">Nursing</option>
          </select>

          <label style={labelStyle}>Filter by Interest:</label>
          <select
            value={searchInterest}
            onChange={(e) => setSearchInterest(e.target.value)}
            style={inputStyle}
          >
            <option value="">All Interests</option>
            <option value="AI">AI</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Marketing">Marketing</option>
            <option value="Software Development">Software Development</option>
            <option value="Project Management">Project Management</option>
          </select>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Program</th>
              <th>Interests</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {filteredMentees.map((mentee, i) => (
              <tr key={i}>
                <td>{mentee.name}</td>
                <td>{mentee.program}</td>
                <td>{mentee.interests}</td>
                <td>{mentee.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={sectionStyle}>
        <h3>Accepted Mentorships / Chat Connections</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Mentee Name</th>
              <th>Program</th>
              <th>Status</th>
              <th>Last Contact</th>
            </tr>
          </thead>
          <tbody>
            {acceptedMentees.map((mentee, i) => (
              <tr key={i}>
                <td>{mentee.name}</td>
                <td>{mentee.program}</td>
                <td style={{ color: "green", fontWeight: "bold" }}>Accepted</td>
                <td>{mentee.lastContact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={sectionStyle}>
        <h3>Mentorship / Chat Requests from Students</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Program</th>
              <th>Request Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, i) => (
              <tr key={i}>
                <td>{req.name}</td>
                <td>{req.program}</td>
                <td>{req.date}</td>
                <td>
                  <button
                    style={acceptBtnStyle}
                    onClick={() => handleRequest(i, true)}
                  >
                    Accept
                  </button>
                  <button
                    style={declineBtnStyle}
                    onClick={() => handleRequest(i, false)}
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

// --- Styles ---
const sectionStyle = {
  background: "#fff",
  padding: "20px",
  marginBottom: "25px",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const labelStyle = {
  display: "block",
  margin: "8px 0 4px",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "16px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};

const acceptBtnStyle = {
  backgroundColor: "#4caf50",
  color: "#fff",
  padding: "6px 12px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "8px",
};

const declineBtnStyle = {
  backgroundColor: "#f44336",
  color: "#fff",
  padding: "6px 12px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default AlumniMentorStudent;
