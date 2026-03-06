import "./Text.css";

interface TextProps {
  children: React.ReactNode;
}

export const Text = ({ children }: TextProps) => {
  return <p className="text">{children}</p>;
};