import "./Logo.css";

interface LogoProps {
  width?: number;
}

export const Logo = ({ width = 120 }: LogoProps) => {
  return (
    <img
      className="logo"
      src="/logo-sena-blanco.png"
      alt="SENA Logo"
      style={{ width: `${width}px` }}
    />
  );
};