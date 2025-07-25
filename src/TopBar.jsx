import React, { useEffect, useState } from "react";

const TopBar = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const currentTheme = document.body.className || "light";
    setTheme(currentTheme);

    const observer = new MutationObserver(() => {
      setTheme(document.body.className || "light");
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap');

          .topbar {
            height: 60px;
            position: sticky;
            top: 0;
            z-index: 900;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Nunito', sans-serif;
            padding: 0 20px;
            text-align: center;
            animation: fadeSlideTop 0.7s ease;
            backdrop-filter: blur(12px);
            transition: background 0.4s ease;
            border-bottom: 1px solid rgba(200, 200, 200, 0.2);
          }

          @keyframes fadeSlideTop {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          body.light .topbar {
            background: rgba(255, 255, 255, 0.85);
            color: #2C3E50;
            border-bottom: 1px solid #ddd;
          }

          body.maroon .topbar {
            background: rgba(44, 10, 20, 0.8);
            color: #ffc2d1;
            border-bottom: 1px solid #ffb3c1;
          }

          .topbar h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 0.5px;
            animation: glowText 2s infinite alternate;
          }

          @keyframes glowText {
            from {
              text-shadow: 0 0 4px rgba(255, 255, 255, 0.3);
            }
            to {
              text-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
            }
          }
        `}
      </style>

      <div className="topbar">
        <h3>Welcome to UniChat Dashboard ✨</h3>
      </div>
    </>
  );
};

export default TopBar;
