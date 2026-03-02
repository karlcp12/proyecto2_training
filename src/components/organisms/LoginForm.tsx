import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';

export const LoginForm = () => (
  <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', width: '350px' }}>
    <img src="/logo-logimat.png" alt="Logimat" style={{ width: '100px' }} />
    <FormField label="Usuario" placeholder="Ingrese su usuario" type="text" />
    <FormField label="Contraseña" placeholder="Ingrese su contraseña" type="password" />
    <p style={{ fontSize: '12px', color: '#1a237e' }}>¿Olvido su contraseña?</p>
    <Button text="Ingresar" />
  </div>
);