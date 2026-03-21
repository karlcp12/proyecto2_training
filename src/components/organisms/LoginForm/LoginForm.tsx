import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../atoms/Logo/Logo";
import { Label } from "../../atoms/Label/Label";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { Link } from "../../atoms/Link/Link";
import "./LoginForm.css";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Simular que el login es exitoso y navegar al app
    navigate("/app");
  };

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
        <div className="password-wrapper">
          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="Ingrese su contraseña" 
          />
          <button 
            type="button" 
            className="password-toggle" 
            onClick={() => setShowPassword(!showPassword)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 13C2 13 5 8 12 8C19 8 22 13 22 13" />
              <circle cx="12" cy="13" r="3" fill="currentColor" />
              {showPassword && <line x1="3" y1="3" x2="21" y2="21" stroke="#ff0000" strokeWidth="2" />}
            </svg>
          </button>
        </div>
      </div>

      <div className="forgot">
        <Link text="¿Olvidó su contraseña?" href="/recover-password" />
      </div>

      <Button text="Ingresar" onClick={handleLogin} />

    </div>
  );
};