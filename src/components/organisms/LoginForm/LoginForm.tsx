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
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
        const response = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store user info in localStorage for basic "session"
            localStorage.setItem('user', JSON.stringify(data.usuario));
            navigate('/app');
        } else {
            setError(data.mensaje || 'Error al iniciar sesión');
        }
    } catch (err) {
        setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="login-card">

      <div className="logo-container">
        <Logo width={170} />
      </div>

      <div className="field">
        <Label text="Usuario" />
        <Input placeholder="Ingrese su usuario" value={user} onChange={(e) => setUser(e.target.value)} />
      </div>

      <div className="field">
        <Label text="Contraseña" />
        <Input type="password" placeholder="Ingrese su contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      {error && <p className="error-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{error}</p>}

      <div className="forgot">
        <Link text="¿Olvidó su contraseña?" href="/recover-password" />
      </div>

      <Button text="Ingresar" onClick={handleLogin} />

    </div>
  );
};