import { Button } from "../components/atoms/Button/Button";
import { Label } from "../components/atoms/Label/Label";
import { Input } from "../components/atoms/Input/Input";
import { Text } from "../components/atoms/Text/Text";
import { Link } from "../components/atoms/Link/Link";
import { Logo } from "../components/atoms/Logo/Logo";
import { Avatar } from "../components/atoms/Avatar/Avatar";

export const AtomPreview = () => {
  return (
    <div style={{ padding: "30px" }}>
      <h2>Buttons</h2>

      <Button text="Ingresar" variant="primary" />
      <br />
      <br />

      <Button text="Editar" variant="warning" />
      <br />
      <br />

      <Button text="Cerrar sesión" variant="danger" />

      <h2>Labels</h2>

      <Label text="Usuario" />
      <Label text="Contraseña" />

      <h2>Inputs</h2>

      <Input placeholder="Ingrese su usuario" />

      <br />
      <br />

      <Input type="password" placeholder="Ingrese su contraseña" />

      <h2>Text</h2>

      <Text>Administrador</Text>

      <Text>Materiales disponibles</Text>

      <Text>Actualizar stock</Text>

      <h2>Links</h2>

      <Link text="¿Olvidó su contraseña?" />

      <br />

      <Link text="Ver detalles" />

      <h2>Logo</h2>

      <Logo />

      <br />

      <Logo width={200} />

      <h2>Avatar</h2>

      <Avatar src="/logimat.jpeg" />

      <br />

      <Avatar src="/logimat.jpeg" size={60} />
    </div>
  );
};
