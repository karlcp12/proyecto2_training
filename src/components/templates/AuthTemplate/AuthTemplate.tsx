import { LoginForm } from "../../organisms/LoginForm/LoginForm";
import "./AuthTemplate.css";

export const AuthTemplate = () => {
  return (
    <div className="auth-template">
      <div className="auth-background"></div>
      <LoginForm />
    </div>
  );
};