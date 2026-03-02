import React from "react";
import Input from "../../atoms/Input/Input";
import "./FormField.css";

interface FormFieldProps {
  label: string;
  type?: "text" | "email" | "password" | "number" | "tel";
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}) => {
  return (
    <div className={`form-field ${error ? "form-field--error" : ""}`}>
      <label className="form-field__label">
        {label}
        {required && <span className="form-field__required">*</span>}
      </label>
      <Input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="form-field__input"
      />
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
};

export default FormField;
