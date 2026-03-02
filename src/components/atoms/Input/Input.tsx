import React from "react";
import "./Input.css";
import classNames from "classnames";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input 
      className={classNames("input", className)} 
      {...props} 
    />
  );
};

export default Input;
