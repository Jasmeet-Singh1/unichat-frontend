import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
          .not-found-container {
            height: 100vh;
            background-color: #F5F7FA;
            color: #222;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
          }

          .not-found-title {
            font-size: 6rem;
            font-weight: 800;
            color: #3A86FF;
          }

          .not-found-subtitle {
            font-size: 1.5rem;
            color: #555;
            margin-bottom: 2rem;
          }

          .not-found-btn {
            padding: 12px 24px;
            background-color: #3A86FF;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.2s ease;
          }

          .not-found-btn:hover {
            transform: scale(1.05);
          }
        `}
      </style>

      <motion.div
        className="not-found-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="not-found-title">404</h1>
        <p className="not-found-subtitle">Oops! Page not found 😢</p>
        <button className="not-found-btn" onClick={() => navigate("/")}>
          Go Home
        </button>
      </motion.div>
    </>
  );
};

export default NotFound;
