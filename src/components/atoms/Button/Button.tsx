import "./Button.css";

interface ButtonProps {
  text: string;
  variant?: "primary" | "warning" | "danger";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export const Button = ({ text, variant = "primary", onClick, type = "button" }: ButtonProps) => {
  return (
    <button className={`button button-${variant}`} onClick={onClick} type={type}>
      {text}
    </button>
  );
};