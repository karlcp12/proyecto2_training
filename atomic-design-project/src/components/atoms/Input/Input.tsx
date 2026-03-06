import "./Input.css";

interface InputProps {
  type?: string;
  placeholder?: string;
}

export const Input = ({ type = "text", placeholder }: InputProps) => {
  return (
    <input
      className="input"
      type={type}
      placeholder={placeholder}
    />
  );
};