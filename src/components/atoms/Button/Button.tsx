import "./Button.css";

interface ButtonProps {
  text: string;
  variant?: "primary" | "warning" | "danger" | "outline";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const Button = ({ text, variant = "primary", onClick, type = "button", className = "" }: ButtonProps) => {
  return (
    <button className={`button button-${variant} ${className}`} onClick={onClick} type={type}>
      {text}
    </button>
  );
};