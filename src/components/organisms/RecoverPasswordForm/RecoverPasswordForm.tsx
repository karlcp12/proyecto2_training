import { Logo } from "../../atoms/Logo/Logo";
import { Label } from "../../atoms/Label/Label";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { Link } from "../../atoms/Link/Link";
import { Text } from "../../atoms/Text/Text";

import "./RecoverPasswordForm.css";

export const RecoverPasswordForm = () => {
  return (
    <div className="recover-card">

      <div className="logo-wrapper">
        <Logo width={150} />
      </div>

      <Text>Recuperar su contraseña</Text>

      <div className="field">
        <Label text="Correo Electronico" />
        <Input placeholder="Ingrese su correo" />
      </div>

      <Button text="Aceptar" />

      <div className="back">
        <Link text="Regresar" href="/" />
      </div>

    </div>
  );
};