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
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const response = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/app");
      } else {
        setError(data.mensaje || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de red, intenta nuevamente.");
    }
  };

  return (
    <div className="login-card">

      <div className="logo-container">
        <Logo width={170} />
      </div>

      <div className="field">
        <Label text="Usuario" />
        <Input 
          placeholder="Ingrese su usuario" 
          value={usuario} 
          onChange={(e) => setUsuario(e.target.value)} 
        />
      </div>

      <div className="field">
        <Label text="Contraseña" />
        <div className="password-wrapper">
          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="Ingrese su contraseña" 
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
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

      {error && <div style={{ color: "red", fontSize: "14px", marginTop: "10px", textAlign: "center" }}>{error}</div>}

      <Button text="Ingresar" onClick={handleLogin} />

    </div>
  );
};