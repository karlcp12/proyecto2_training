import "./Logo.css";

interface LogoProps {
  width?: number;
  src?: string;
  className?: string;
}

export const Logo = ({ width = 120, src = "/logo-sena-blanco.png", className = "logo" }: LogoProps) => {
  return (
    <img
      className={className}
      src={src}
      alt="App Logo"
      style={{ width: `${width}px` }}
    />
  );
};