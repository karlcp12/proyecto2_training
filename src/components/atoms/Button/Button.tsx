import "./Button.css";

interface ButtonProps {
  text: string;
  variant?: "primary" | "warning" | "danger";
  onClick?: () => void;
}

export const Button = ({ text, variant = "primary", onClick }: ButtonProps) => {
  return (
    <button className={`button button-${variant}`} onClick={onClick}>
      {text}
    </button>
  );
};