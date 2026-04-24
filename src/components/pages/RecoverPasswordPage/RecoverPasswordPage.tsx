import { AuthTemplate } from "../../templates/AuthTemplate/AuthTemplate";
import { RecoverPasswordForm } from "../../organisms/RecoverPasswordForm/RecoverPasswordForm";

export const RecoverPasswordPage = () => {
  return (
    <AuthTemplate>
      <RecoverPasswordForm />
    </AuthTemplate>
  );
};