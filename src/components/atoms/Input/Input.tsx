import "./Input.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Las props estándar de input se heredan
}

export const Input = ({ ...rest }: InputProps) => {
  return (
    <input
      className="input"
      {...rest}
    />
  );
};