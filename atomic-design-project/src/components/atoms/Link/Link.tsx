import "./Link.css";

interface LinkProps {
  text: string;
  href?: string;
}

export const Link = ({ text, href = "#" }: LinkProps) => {
  return (
    <a className="link" href={href}>
      {text}
    </a>
  );
};