import { Logo } from "../../atoms/Logo/Logo";
import { Label } from "../../atoms/Label/Label";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { Link } from "../../atoms/Link/Link";
import "./LoginForm.css";

export const LoginForm = () => {
  return (
    <div className="login-card">

      <div className="logo-container">
        <Logo width={170} />
      </div>

      <div className="field">
        <Label text="Usuario" />
        <Input placeholder="Ingrese su usuario" />
      </div>

      <div className="field">
        <Label text="Contraseña" />
        <Input type="password" placeholder="Ingrese su contraseña" />
      </div>

      <div className="forgot">
  <Link text="¿Olvidó su contraseña?" href="/recover-password" />
</div>

      <Button text="Ingresar" />

    </div>
  );
};