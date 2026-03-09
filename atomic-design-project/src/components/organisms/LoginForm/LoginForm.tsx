import { Logo } from "../../atoms/Logo/Logo";
import { Button } from "../../atoms/Button/Button";
import { FormField } from "../../molecules/FormField/FormField";
import { ForgotPassword } from "../../molecules/ForgotPassword/ForgotPassword";
import "./LoginForm.css";

export const LoginForm = () => {
  return (
    <div className="login-card">

      <div className="logo-container">
        <Logo width={180} />
      </div>

      <FormField
        label="Usuario"
        placeholder="Ingrese su usuario"
      />

      <FormField
        label="Contraseña"
        type="password"
        placeholder="Ingrese su contraseña"
      />

      <ForgotPassword />

      <Button text="Ingresar" />

    </div>
  );
};