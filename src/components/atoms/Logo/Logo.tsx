import "./Logo.css";

interface LogoProps {
  width?: number;
}

export const Logo = ({ width = 120 }: LogoProps) => {
  return (
    <img
      className="logo"
      src="/logimat.jpeg"
      alt="Logimat Logo"
      style={{ width: `${width}px` }}
    />
  );
};