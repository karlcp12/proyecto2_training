import React, { useState } from "react";
import Card from "../../atoms/Card/Card";
import Button from "../../atoms/Button/Button";
import Typography from "../../atoms/Typography/Typography";
import LogoHeader from "../../molecules/LogoHeader";
import FormField from "../../molecules/FormField";
import PasswordField from "../../molecules/PasswordField";
import "./LoginForm.css";

// Credenciales de prueba
const VALID_CREDENTIALS = {
  username: "admin",
  password: "admin123"
};

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simular validación de credenciales
    setTimeout(() => {
      if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
        // Login exitoso
        alert("¡Login exitoso! Bienvenido admin");
        setLoading(false);
      } else {
        setError("Usuario o contraseña incorrectos");
        setLoading(false);
      }
    }, 1000);
  };

  const handleForgotPassword = () => {
    // Navegar a la página de recuperación de contraseña
    alert("Función de recuperación de contraseña - En desarrollo");
  };

  return (
    <Card>
      <form className="login-form" onSubmit={handleSubmit}>
        <LogoHeader 
          title="Iniciar Sesión" 
          subtitle="Bienvenido de nuevo" 
        />

        {error && (
          <div className="login-form__error">
            <Typography variant="small" align="center">
              {error}
            </Typography>
          </div>
        )}

        <FormField
          label="Usuario"
          placeholder="Ingrese su usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <PasswordField
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="login-form__forgot">
          <span 
            className="login-form__forgot-link"
            onClick={handleForgotPassword}
          >
            <Typography variant="small" align="right">
              ¿Olvidó su contraseña?
            </Typography>
          </span>
        </div>

        <Button type="submit" loading={loading}>
          Ingresar
        </Button>

      </form>
    </Card>
  );
};

export default LoginForm;
