import React from "react";
import "./AuthTemplate.css";

interface AuthTemplateProps {
  children: React.ReactNode;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({ children }) => {
  return (
    <div className="auth-template">
      <div className="auth-background"></div>
      {children}
    </div>
  );
};