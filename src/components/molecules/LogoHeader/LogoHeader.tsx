import React from "react";
import Logo from "../../atoms/Logo/Logo";
import Typography from "../../atoms/Typography/Typography";
import "./LogoHeader.css";

interface LogoHeaderProps {
  title: string;
  subtitle?: string;
}

const LogoHeader: React.FC<LogoHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="logo-header">
      <Logo size="lg" />
      <div className="logo-header__content">
        <Typography variant="h1" align="center">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body" align="center">
            {subtitle}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default LogoHeader;
