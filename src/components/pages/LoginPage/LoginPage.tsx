import { AuthTemplate } from "../../templates/AuthTemplate/AuthTemplate";
import { LoginForm } from "../../organisms/LoginForm/LoginForm";

export const LoginPage = () => {
  return (
    <AuthTemplate>
      <LoginForm />
    </AuthTemplate>
  );
};