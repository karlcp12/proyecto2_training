import { Label } from "../../atoms/Label/Label";
import { Input } from "../../atoms/Input/Input";
import "./FormField.css";

interface FormFieldProps {
  label: string;
  placeholder: string;
  type?: string;
}

export const FormField = ({ label, placeholder, type = "text" }: FormFieldProps) => {
  return (
    <div className="form-field">
      <Label text={label} />
      <Input type={type} placeholder={placeholder} />
    </div>
  );
};