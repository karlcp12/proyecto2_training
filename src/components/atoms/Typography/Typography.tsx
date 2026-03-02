import React from "react";
import "./Typography.css";

interface TypographyProps {
  variant?: "h1" | "h2" | "body" | "small";
  align?: "left" | "center" | "right";
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  align = "left",
  children,
}) => {
  return (
    <p className={`typography typography--${variant} typography--${align}`}>
      {children}
    </p>
  );
};

export default Typography;