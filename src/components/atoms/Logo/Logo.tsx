import React from "react";
import "./Logo.css";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
}

const Logo: React.FC<LogoProps> = ({ size = "md", variant = "default" }) => {
  return (
    <div className={`logo logo--${size} logo--${variant}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="45" fill="#2db100" />
        <path
          d="M35 50L50 35L65 50L50 65L35 50Z"
          fill="white"
        />
        <circle cx="50" cy="50" r="12" fill="#2db100" />
      </svg>
    </div>
  );
};

export default Logo;
