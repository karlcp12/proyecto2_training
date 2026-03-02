import React from "react";
import "./Logo.css";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "md", className }) => {
  return (
    <div className={`logo logo--${size} ${className || ""}`}>
      <img
        src=""
        alt="Logimat" 
        className="logo__image"
      />
    </div>
  );
};

export default Logo;
