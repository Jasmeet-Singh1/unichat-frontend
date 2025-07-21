import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import "./Signup.css";

const programTypesData = [
    "Post-Baccalaureate",
    "Post-Degree Diploma",
    "Master’s",
    "PhD",
    "Diploma",
    "Associate Degree",
    "Bachelor's",
    "Certificate",
    "Undergraduate",
    "Other",
];
const programNamesData = [
    "Business Administration",
    "Engineering",
    "Psychology",
    "Computer Science",
    "Health Sciences",
    "Nursing",
    "Education",
    "Arts",
    "Science",
    "Social Work",
];
const facultyData = [
    "Science",
    "Business",
    "Engineering",
    "Faculty of Arts",
    "Faculty of Health",
    "Faculty of Trades and Technology",
    "Faculty of Academic and Career Advancement",
    "Faculty of Education",
    "Faculty of Global and Community Studies",
];
const coursesData = [
    "CS 1000 - Intro to Programming",
    "CS 1100 - Data Structures",
    "MATH 1100 - Calculus I",
    "ENG 1200 - Academic Writing",
    "BIO 1010 - General Biology",
    "CHEM 1010 - General Chemistry",
    "PSYCH 1010 - Introduction to Psychology",
    "HIST 1010 - World History",
    "ECON 1010 - Principles of Economics",
    "PHIL 1010 - Introduction to Philosophy",
];

const Signup = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState(() => {
        const savedRole = localStorage.getItem("role") || "";
        return {
            firstName: "",
            lastName: "",
            role: savedRole,
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            bio: "",
            programName: "",
            programType: "",
            courseEnrolled: "",
            courseName: "",
            semester: "",
            year: "",
            instructor: "",
            gradDate: "",
            clubs: [],
            designation: "",
            courseExpertise: "",
            topicCovered: "",
            availabilityDays: [],
            availabilityFrom: "",
            availabilityTo: "",
            mentorProof: null,
            alumniProof: null,
            faculty: "",
            jobCompany: "",
            jobTitle: "",
            jobStart: "",
            alumniGradDate: "",
        };
    });

    useEffect(() => {
        localStorage.setItem("role", formData.role);
    }, [formData.role]);

    const requiredFieldsByStep = {
        1: ["firstName"],
        2: ["role", "email", "password", "confirmPassword"],
        3: formData.role === "Student" || formData.role === "Mentor" ? ["bio"] : [],
        4:
            formData.role === "Student" || formData.role === "Mentor"
                ? [
                    "programName",
                    "programType",
                    "faculty",
                    "courseEnrolled",
                    "courseName",
                    "semester",
                    "year",
                ]
                : formData.role === "Alumni"
                    ? ["programName", "programType", "faculty", "alumniGradDate"]
                    : [],
        5:
            formData.role === "Student"
                ? ["gradDate"]
                : formData.role === "Mentor"
                    ? ["courseExpertise", "courseName", "topicCovered"]
                    : formData.role === "Alumni"
                        ? ["alumniProof"]
                        : [],
        6:
            formData.role === "Student"
                ? ["designation"]
                : formData.role === "Mentor"
                    ? []
                    : [],
        7: formData.role === "Mentor" ? ["mentorProof"] : [],
    };

    const validateFields = () => {
        const fieldsToCheck = requiredFieldsByStep[step] || [];
        for (let field of fieldsToCheck) {
            if (!formData[field]) {
                alert(`⚠️ ${field.replace(/([A-Z])/g, ' $1').trim()} is required!`);
                return false;
            }
        }
        if (step === 2) {
            const passwordRegex = /^.{6,}$/;
            if (!passwordRegex.test(formData.password)) {
                alert("Password must be at least 6 characters long.");
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match.");
                return false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert("Please enter a valid email address.");
                return false;
            }
        }
        if (
            step === 4 &&
            (formData.role === "Student" || formData.role === "Mentor")
        ) {
            const yearRegex = /^\d{4}$/;
            if (!yearRegex.test(formData.year)) {
                alert("Year must be a valid 4-digit year (e.g., 2023).");
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (!validateFields()) return;

        if (formData.role === "Student" && step >= 6) {
            alert("Student account created successfully.");
            navigate("/login");
            return;
        }

        if (formData.role === "Mentor" && step >= 7) {
            alert("Mentor request submitted. You will be notified after approval.");
            navigate("/login");
            return;
        }

        if (formData.role === "Alumni" && step >= 5) {
            alert("Alumni request submitted. You will be notified after approval.");
            navigate("/login");
            return;
        }

        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const handleChange = (e) => {
        const { name, value, type, files, multiple } = e.target;
        if (multiple && type === "select-multiple") {
            const options = [...e.target.selectedOptions].map((o) => o.value);
            setFormData((prev) => ({ ...prev, [name]: options }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "file" ? files[0] : value,
            }));
        }
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="signup">
            <div className="gradient-boxes">
                {Array.from({ length: 80 }).map((_, i) => (
                    <div key={i} />
                ))}
            </div>
            <div className="signup-container">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {step === 1 && (
                            <div className="form-block">
                                <h2>Step 1: Name</h2>
                                <div className="input-group">
                                    <label>
                                        First Name*{" "}
                                        <span
                                            data-tooltip-id="firstName-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip id="firstName-tooltip" content="Your given name" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>
                                        Last Name{" "}
                                        <span
                                            data-tooltip-id="lastName-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="lastName-tooltip"
                                        content="Your family name (optional)"
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="form-block">
                                <h2>Step 2: Role & Account</h2>
                                <div className="input-group">
                                    <label>
                                        Role*{" "}
                                        <span data-tooltip-id="role-tooltip" className="info-icon">
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="role-tooltip"
                                        content="Select your role in the system"
                                    />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Role</option>
                                        <option value="Student">Student</option>
                                        <option value="Mentor">Mentor</option>
                                        <option value="Alumni">Alumni</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>
                                        Username{" "}
                                        <span
                                            data-tooltip-id="username-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="username-tooltip"
                                        content="Optional unique identifier"
                                    />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>
                                        Email*{" "}
                                        <span data-tooltip-id="email-tooltip" className="info-icon">
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="email-tooltip"
                                        content="Your email address for login"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="input-group password-wrapper">
                                    <label>
                                        Password*{" "}
                                        <span
                                            data-tooltip-id="password-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="password-tooltip"
                                        content="Must contain at least 1 lowercase, 1 uppercase, 1 number, 1 special character (!@#$%^&*), and be more than 7 characters"
                                    />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span onClick={togglePassword}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                <div className="input-group password-wrapper">
                                    <label>
                                        Confirm Password*{" "}
                                        <span
                                            data-tooltip-id="confirmPassword-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="confirmPassword-tooltip"
                                        content="Must match the password"
                                    />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span onClick={toggleConfirmPassword}>
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>
                        )}

                        {step === 3 &&
                            (formData.role === "Student" || formData.role === "Mentor") && (
                                <div className="form-block">
                                    <h2>Step 3: Bio</h2>
                                    <div className="input-group">
                                        <label>
                                            Bio*{" "}
                                            <span data-tooltip-id="bio-tooltip" className="info-icon">
                                                i
                                            </span>
                                        </label>
                                        <Tooltip
                                            id="bio-tooltip"
                                            content="A short description about yourself"
                                        />
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                            )}

                        {(formData.role === "Student" || formData.role === "Mentor") &&
                            step === 4 && (
                                <>
                                    <div className="form-block">
                                        <h2>Step 4: Academic Info</h2>
                                        <div className="input-group">
                                            <label>
                                                Program Name*{" "}
                                                <span
                                                    data-tooltip-id="programName-tooltip"
                                                    className="info-icon"
                                                >
                                                    i
                                                </span>
                                            </label>
                                            <Tooltip
                                                id="programName-tooltip"
                                                content="Name of your academic program"
                                            />
                                            <select
                                                name="programName"
                                                value={formData.programName}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Program</option>
                                                {programNamesData.map((program) => (
                                                    <option key={program} value={program}>
                                                        {program}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="input-group">
                                            <label>
                                                Program Type*{" "}
                                                <span
                                                    data-tooltip-id="programType-tooltip"
                                                    className="info-icon"
                                                >
                                                    i
                                                </span>
                                            </label>
                                            <Tooltip
                                                id="programType-tooltip"
                                                content="Type of program (e.g., Undergraduate, Graduate)"
                                            />
                                            <select
                                                name="programType"
                                                value={formData.programType}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Program Type</option>
                                                {programTypesData.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="input-group">
                                            <label>
                                                Faculty*{" "}
                                                <span
                                                    data-tooltip-id="faculty-tooltip"
                                                    className="info-icon"
                                                >
                                                    i
                                                </span>
                                            </label>
                                            <Tooltip
                                                id="faculty-tooltip"
                                                content="Faculty of your program"
                                            />
                                            <select
                                                name="faculty"
                                                value={formData.faculty}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Faculty</option>
                                                {facultyData.map((faculty) => (
                                                    <option key={faculty} value={faculty}>
                                                        {faculty}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="input-group">
                                            <label>
                                                Course Enrolled*{" "}
                                                <span
                                                    data-tooltip-id="courseEnrolled-tooltip"
                                                    className="info-icon"
                                                >
                                                    i
                                                </span>
                                            </label>
                                            <Tooltip
                                                id="courseEnrolled-tooltip"
                                                content="Current course you are enrolled in"
                                            />
                                            <input
                                                type="text"
                                                name="courseEnrolled"
                                                value={formData.courseEnrolled}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>
                                                Course Name*{" "}
                                                <span
                                                    data-tooltip-id="courseName-tooltip"
                                                    className="info-icon"
                                                >
                                                    i
                                                </span>
                                            </label>
                                            <Tooltip
                                                id="courseName-tooltip"
                                                content="Name of the course"
                                            />
                                            <select
                                                name="courseName"
                                                value={formData.courseName}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Course</option>
                                                {coursesData.map((course) => (
                                                    <option key={course} value={course}>
                                                        {course}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="input-group">
                                            <label>
                                                Semester*{" "}
                                                <span
                                                    data-tooltip-id="semester-tooltip"
                                                    className="info-icon"
                                                >
                                                    i
                                                </span>
                                            </label>
                                            <Tooltip
                                                id="semester-tooltip"
                                                content="Current semester of study"
                                            />
                                            <input
                                                type="text"
                                                name="semester"
                                                value={formData.semester}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>
                                                Year*{" "}
                                                <span
                                                    data-tooltip-id="year-tooltip"
                                                    className="info-icon"
                                                >
                                                    i
                                                </span>
                                            </label>
                                            <Tooltip
                                                id="year-tooltip"
                                                content="Year of study (e.g., 2023)"
                                            />
                                            <input
                                                type="number"
                                                name="year"
                                                value={formData.year}
                                                onChange={handleChange}
                                                min="1900"
                                                max="2099"
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>
                                                Instructor{" "}
                                                <span
                                                    data-tooltip-id="instructor-tooltip"
                                                    className="info-icon"
                                                >
                                                    i
                                                </span>
                                            </label>
                                            <Tooltip
                                                id="instructor-tooltip"
                                                content="Name of your instructor (optional)"
                                            />
                                            <input
                                                type="text"
                                                name="instructor"
                                                value={formData.instructor}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                        {formData.role === "Student" && step === 5 && (
                            <div className="form-block">
                                <h2>Step 5: Graduation Date</h2>
                                <div className="input-group">
                                    <label>
                                        Graduation Date*{" "}
                                        <span
                                            data-tooltip-id="gradDate-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="gradDate-tooltip"
                                        content="Expected graduation date"
                                    />
                                    <input
                                        type="date"
                                        name="gradDate"
                                        value={formData.gradDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {formData.role === "Student" && step === 6 && (
                            <div className="form-block">
                                <h2>Step 6: Clubs</h2>
                                <div className="input-group">
                                    <label>
                                        Clubs{" "}
                                        <span data-tooltip-id="clubs-tooltip" className="info-icon">
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="clubs-tooltip"
                                        content="Select clubs you are part of (hold Ctrl/Cmd to select multiple)"
                                    />
                                    <select
                                        multiple
                                        name="clubs"
                                        value={formData.clubs}
                                        onChange={handleChange}
                                    >
                                        <option value="Coding Club">Coding Club</option>
                                        <option value="AI Society">AI Society</option>
                                        <option value="Drama Club">Drama Club</option>
                                        <option value="Photography Club">Photography Club</option>
                                        <option value="Debate Society">Debate Society</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>
                                        Designation*{" "}
                                        <span
                                            data-tooltip-id="designation-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="designation-tooltip"
                                        content="Your role in the selected clubs"
                                    />
                                    <select
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Designation</option>
                                        <option value="President">President</option>
                                        <option value="Member">Member</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {formData.role === "Mentor" && step === 5 && (
                            <div className="form-block">
                                <h2>Step 5: Expertise</h2>
                                <div className="input-group">
                                    <label>
                                        Course Expertise*{" "}
                                        <span
                                            data-tooltip-id="courseExpertise-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="courseExpertise-tooltip"
                                        content="Your area of expertise"
                                    />
                                    <input
                                        type="text"
                                        name="courseExpertise"
                                        value={formData.courseExpertise}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>
                                        Course Name*{" "}
                                        <span
                                            data-tooltip-id="courseNameMentor-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="courseNameMentor-tooltip"
                                        content="Name of the course you teach"
                                    />
                                    <select
                                        name="courseName"
                                        value={formData.courseName}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Course</option>
                                        {coursesData.map((course) => (
                                            <option key={course} value={course}>
                                                {course}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>
                                        Topics Covered*{" "}
                                        <span
                                            data-tooltip-id="topicCovered-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="topicCovered-tooltip"
                                        content="Topics you cover in your course"
                                    />
                                    <input
                                        type="text"
                                        name="topicCovered"
                                        value={formData.topicCovered}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>
                                        Instructor{" "}
                                        <span
                                            data-tooltip-id="instructorMentor-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="instructorMentor-tooltip"
                                        content="Name of the instructor (optional)"
                                    />
                                    <input
                                        type="text"
                                        name="instructor"
                                        value={formData.instructor}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        {formData.role === "Mentor" && step === 6 && (
                            <div className="form-block">
                                <h2>Step 6: Availability</h2>
                                <div className="input-group">
                                    <label>
                                        Availability Days{" "}
                                        <span
                                            data-tooltip-id="availabilityDays-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="availabilityDays-tooltip"
                                        content="Select days you are available"
                                    />
                                    <select
                                        multiple
                                        name="availabilityDays"
                                        value={formData.availabilityDays}
                                        onChange={handleChange}
                                    >
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Friday">Friday</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>
                                        From Time{" "}
                                        <span
                                            data-tooltip-id="availabilityFrom-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="availabilityFrom-tooltip"
                                        content="Start time of availability"
                                    />
                                    <input
                                        type="time"
                                        name="availabilityFrom"
                                        value={formData.availabilityFrom}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>
                                        To Time{" "}
                                        <span
                                            data-tooltip-id="availabilityTo-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="availabilityTo-tooltip"
                                        content="End time of availability"
                                    />
                                    <input
                                        type="time"
                                        name="availabilityTo"
                                        value={formData.availabilityTo}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        {formData.role === "Mentor" && step === 7 && (
                            <div className="form-block">
                                <h2>Step 7: Upload Proof</h2>
                                <div className="input-group">
                                    <label>
                                        Mentor Proof*{" "}
                                        <span
                                            data-tooltip-id="mentorProof-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="mentorProof-tooltip"
                                        content="Upload proof of your mentor status (PDF, JPG, PNG)"
                                    />
                                    <input
                                        type="file"
                                        name="mentorProof"
                                        accept=".pdf,.jpg,.png"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {formData.role === "Alumni" && step === 3 && (
                            <div className="form-block">
                                <h2>Step 3: Graduation Info</h2>
                                <div className="input-group">
                                    <label>
                                        Program Name*{" "}
                                        <span
                                            data-tooltip-id="programNameAlumni-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="programNameAlumni-tooltip"
                                        content="Name of your academic program"
                                    />
                                    <select
                                        name="programName"
                                        value={formData.programName}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Program</option>
                                        {programNamesData.map((program) => (
                                            <option key={program} value={program}>
                                                {program}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>
                                        Program Type*{" "}
                                        <span
                                            data-tooltip-id="programTypeAlumni-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="programTypeAlumni-tooltip"
                                        content="Type of program (e.g., Undergraduate, Graduate)"
                                    />
                                    <select
                                        name="programType"
                                        value={formData.programType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Program Type</option>
                                        {programTypesData.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>
                                        Faculty*{" "}
                                        <span
                                            data-tooltip-id="faculty-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="faculty-tooltip"
                                        content="Faculty of your program"
                                    />
                                    <select
                                        name="faculty"
                                        value={formData.faculty}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Faculty</option>
                                        {facultyData.map((faculty) => (
                                            <option key={faculty} value={faculty}>
                                                {faculty}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>
                                        Graduation Date*{" "}
                                        <span
                                            data-tooltip-id="alumniGradDate-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="alumniGradDate-tooltip"
                                        content="Date of your graduation"
                                    />
                                    <input
                                        type="date"
                                        name="alumniGradDate"
                                        value={formData.alumniGradDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {formData.role === "Alumni" && step === 4 && (
                            <div className="form-block">
                                <h2>Step 4: Current Job (optional)</h2>
                                <div className="input-group">
                                    <label>
                                        Company Name{" "}
                                        <span
                                            data-tooltip-id="jobCompany-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="jobCompany-tooltip"
                                        content="Name of your current employer"
                                    />
                                    <input
                                        type="text"
                                        name="jobCompany"
                                        value={formData.jobCompany}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>
                                        Job Title{" "}
                                        <span
                                            data-tooltip-id="jobTitle-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="jobTitle-tooltip"
                                        content="Your current job title"
                                    />
                                    <input
                                        type="text"
                                        name="jobTitle"
                                        value={formData.jobTitle}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>
                                        Job Start Date{" "}
                                        <span
                                            data-tooltip-id="jobStart-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="jobStart-tooltip"
                                        content="Start date of your current job"
                                    />
                                    <input
                                        type="date"
                                        name="jobStart"
                                        value={formData.jobStart}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        {formData.role === "Alumni" && step === 5 && (
                            <div className="form-block">
                                <h2>Step 5: Upload Proof of Former Student</h2>
                                <div className="input-group">
                                    <label>
                                        Alumni Proof*{" "}
                                        <span
                                            data-tooltip-id="alumniProof-tooltip"
                                            className="info-icon"
                                        >
                                            i
                                        </span>
                                    </label>
                                    <Tooltip
                                        id="alumniProof-tooltip"
                                        content="Upload proof of your alumni status (PDF, JPG, PNG)"
                                    />
                                    <input
                                        type="file"
                                        name="alumniProof"
                                        accept=".pdf,.jpg,.png"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="button-group">
                    {step > 1 && <button onClick={handleBack}>Back</button>}
                    <button onClick={handleNext}>Next</button>
                </div>
                <p className="login-text">
                    Already have an account?{" "}
                    <a href="/login" className="login-link">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
