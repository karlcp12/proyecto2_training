import "./Label.css";

interface LabelProps {
  text: string;
}

export const Label = ({ text }: LabelProps) => {
  return <label className="label">{text}</label>;
};