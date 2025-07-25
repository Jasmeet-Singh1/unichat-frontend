import { useState, useRef } from "react";

const AlumniSetting = () => {
  const [view, setView] = useState(null);
  const [tags, setTags] = useState(["Java", "Mentoring", "Public Speaking"]);
  const [experience, setExperience] = useState("");
  const inputRef = useRef(null);

  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    startDate: "",
    endDate: "",
    mentorWillingness: "yes",
  });

  const [account, setAccount] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleTagInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = e.target.value.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        e.target.value = "";
      }
    }
  };

  const removeTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  const handleExperienceChange = (e) => setExperience(e.target.value);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = account;

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password should be at least 6 characters.");
      return;
    }
    alert("Password updated successfully!");
    setAccount({
      username: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <main style={styles.main}>
      {!view && (
        <div style={styles.optionsContainer}>
          <div style={styles.optionCard} onClick={() => setView("editProfile")}>
            <span style={styles.optionIcon}>👤</span> Edit Profile
          </div>
          <div
            style={styles.optionCard}
            onClick={() => setView("accountSettings")}
          >
            <span style={styles.optionIcon}>🔒</span> Account Settings
          </div>
        </div>
      )}

      {view === "editProfile" && (
        <form style={styles.form} onSubmit={handleProfileSubmit}>
          <button style={styles.backButton} onClick={() => setView(null)}>← Previous</button>
          <h3>Edit Profile</h3>

          <label>Skills</label>
          <div
            style={styles.tagsInput}
            onClick={() => inputRef.current?.focus()}
          >
            {tags.map((tag, i) => (
              <div key={i} style={styles.tag}>
                {tag}
                <span onClick={() => removeTag(i)} style={styles.removeTag}>
                  ×
                </span>
              </div>
            ))}
            <input
              type="text"
              placeholder="Type and press Enter to add skill"
              onKeyDown={handleTagInput}
              ref={inputRef}
              style={styles.tagInput}
            />
          </div>

          <label>Experience</label>
          <textarea
            maxLength="500"
            value={experience}
            onChange={handleExperienceChange}
            placeholder="Describe your mentoring or professional experience..."
            style={styles.textarea}
          />
          <div style={styles.charCount}>{experience.length} / 500</div>

          <label>Willingness to Mentor</label>
          <div style={styles.toggleGroup}>
            {["yes", "maybe", "no"].map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="mentorWillingness"
                  value={value}
                  checked={formData.mentorWillingness === value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mentorWillingness: e.target.value,
                    })
                  }
                />
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </label>
            ))}
          </div>

          <label>Current Job Title</label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) =>
              setFormData({ ...formData, jobTitle: e.target.value })
            }
            placeholder="e.g. Software Developer"
            style={styles.input}
          />

          <label>Company Name</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            placeholder="e.g. Google"
            style={styles.input}
          />

          <label>Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            style={styles.input}
          />

          <label>End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            placeholder="Leave blank if currently employed"
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Save Changes
          </button>
        </form>
      )}

      {view === "accountSettings" && (
        <form style={styles.form} onSubmit={handleAccountSubmit}>
          <button style={styles.backButton} onClick={() => setView(null)}>← Previous</button>
          <h3>Account Settings</h3>

          <label>User Name</label>
          <input
            type="text"
            value={account.username}
            onChange={(e) =>
              setAccount({ ...account, username: e.target.value })
            }
            required
            style={styles.input}
          />

          <label>Current Password</label>
          <input
            type="password"
            value={account.currentPassword}
            onChange={(e) =>
              setAccount({ ...account, currentPassword: e.target.value })
            }
            required
            style={styles.input}
          />

          <label>New Password</label>
          <input
            type="password"
            value={account.newPassword}
            onChange={(e) =>
              setAccount({ ...account, newPassword: e.target.value })
            }
            required
            style={styles.input}
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            value={account.confirmPassword}
            onChange={(e) =>
              setAccount({ ...account, confirmPassword: e.target.value })
            }
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Update Password
          </button>
        </form>
      )}
    </main>
  );
};

const styles = {
  main: {
    padding: "20px 30px 30px",
    backgroundColor: "#f4f4f4",
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
    maxWidth: "800px",
    margin: "0 auto",
  },
  optionsContainer: {
    display: "flex",
    gap: "20px",
    flexDirection: "column",
  },
  optionCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    fontSize: "20px",
    color: "#222",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "background-color 0.2s ease",
  },
  optionIcon: {
    fontSize: "28px",
  },
  form: {
    backgroundColor: "#fff",
    padding: "25px 30px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    fontSize: "16px",
  },
  backButton: {
    backgroundColor: "#3A86FF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "6px 14px",
    marginBottom: "20px",
    cursor: "pointer",
    fontSize: "14px",
    display: "inline-block",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "15px",
  },
  textarea: {
    width: "100%",
    padding: "8px 12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minHeight: "100px",
    resize: "vertical",
  },
  charCount: {
    fontSize: "12px",
    color: "#666",
    marginTop: "4px",
    marginBottom: "16px",
  },
  toggleGroup: {
    display: "flex",
    gap: "20px",
    marginBottom: "15px",
  },
  button: {
    backgroundColor: "#444",
    color: "white",
    fontSize: "18px",
    padding: "10px 25px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  tagsInput: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minHeight: "42px",
    backgroundColor: "#fff",
    marginBottom: "15px",
  },
  tag: {
    backgroundColor: "#555",
    color: "#fff",
    padding: "6px 12px",
    margin: "4px 6px 4px 0",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
  },
  removeTag: {
    marginLeft: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  tagInput: {
    border: "none",
    outline: "none",
    fontSize: "16px",
    padding: "6px",
    flexGrow: 1,
    minWidth: "120px",
  },
};

export default AlumniSetting;
