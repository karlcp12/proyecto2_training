import "./Button.css";

interface ButtonProps {
  text: string;
  variant?: "primary" | "warning" | "danger";
}

export const Button = ({ text, variant = "primary" }: ButtonProps) => {
  return (
    <button className={`button button-${variant}`}>
      {text}
    </button>
  );
};