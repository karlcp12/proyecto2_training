import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../atoms/Logo/Logo";
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
    <div className="login-container-wrapper">
      <div className="login-card-new">
        {/* Left Side: Branding */}
        <div className="login-left-image">
          {/* Background image will be handled in CSS */}
          <div className="logo-overlay">
            <Logo width={220} />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="login-right">
          <div className="form-inner-card">
            <div className="form-header-alt">
              <img src="/LogoLogitmat_sin_fondo.png" alt="Logimat Logo" className="form-brand-logo" />
              <p className="main-message">Accede al sistema de gestión de inventario <strong>LOGIMAT</strong> con tus credenciales asignadas</p>
            </div>

            <form onSubmit={handleLogin} className="login-form-fields-new">
              <div className="input-group">
                <div className="input-with-icon">
                  <Input 
                    placeholder="Usuario o correo" 
                    value={user} 
                    onChange={(e) => setUser(e.target.value)} 
                    className="input-field-alt"
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-with-icon">
                  <Input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="input-field-alt"
                  />
                </div>
              </div>

              {error && <p className="error-message-new">{error}</p>}

              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Recordarme</label>
                </div>
                <Link text="¿Olvidó su contraseña?" href="/recover-password" className="forgot-link-alt" />
              </div>

              <div className="form-actions-alt">
                <Button 
                  text="INGRESAR" 
                  type="submit"
                  className="btn-login-alt"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};