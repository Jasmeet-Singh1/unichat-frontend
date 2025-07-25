import React, { useEffect, useState } from "react";

const Footer = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(document.body.className || "light");
  }, []);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap');

          .footer {
            font-family: 'Nunito', sans-serif;
            text-align: center;
            padding: 24px;
            font-size: 14px;
            transition: background 0.5s ease, color 0.4s ease;
            animation: footerFade 1s ease-in;
            user-select: none;
          }

          @keyframes footerFade {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          body.light .footer {
            background: linear-gradient(135deg, #f3e8ff, #e9d8fd);
            color: #444;
          }

          body.maroon .footer {
            background: linear-gradient(135deg, #2d0a12, #4c0519);
            color: #ffc2d1;
          }

          .footer:hover {
            letter-spacing: 0.5px;
            color: #9f7aea;
          }

          .footer span {
            display: inline-block;
            transition: transform 0.3s ease;
            cursor: default;
          }

          .footer span:hover {
            transform: rotate(8deg) scale(1.1);
            filter: drop-shadow(0 0 5px #c084fc);
          }
        `}
      </style>
      <footer className="footer">
        <span>© 2025 🌟 UniChat</span> — Designed with ❤️ for KPU Students & Alumni
      </footer>
    </>
  );
};

export default Footer;
