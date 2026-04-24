import "./Link.css";

interface LinkProps {
  text: string;
  href?: string;
  className?: string;
}

export const Link = ({ text, href = "#", className = "" }: LinkProps) => {
  return (
    <a className={`link ${className}`} href={href}>
      {text}
    </a>
  );
};