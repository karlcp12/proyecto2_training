import React, { useState } from "react";
import Input from "../../atoms/Input/Input";
import "./PasswordField.css";

interface PasswordFieldProps {
  label?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label = "Contraseña",
  placeholder,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`password-field ${error ? "password-field--error" : ""}`}>
      {label && (
        <label className="password-field__label">
          {label}
          {required && <span className="password-field__required">*</span>}
        </label>
      )}
      <div className="password-field__wrapper">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="password-field__input"
        />
        <button
          type="button"
          className="password-field__toggle"
          onClick={togglePassword}
          tabIndex={-1}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && <span className="password-field__error">{error}</span>}
    </div>
  );
};

export default PasswordField;
