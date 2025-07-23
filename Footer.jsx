import React from "react";

const Footer = () => {
  return (
    <>
      <style>
        {`
          .footer {
            text-align: center;
            padding: 24px;
            font-size: 13px;
            color: #666;
            background: #f3e8ff;
          }
        `}
      </style>
      <footer className="footer">
        © 2025 UniChat - Designed for KPU Students & Alumni
      </footer>
    </>
  );
};

export default Footer;
