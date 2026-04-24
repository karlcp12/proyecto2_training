import { Logo } from "../../atoms/Logo/Logo";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { Link } from "../../atoms/Link/Link";

import "../LoginForm/LoginForm.css";

export const RecoverPasswordForm = () => {
  return (
    <div className="login-container-wrapper">
      <div className="login-card-new">
        {/* Left Side: Branding */}
        <div className="login-left-image">
          <div className="logo-overlay">
            <Logo width={220} />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="login-right">
          <div className="form-inner-card">
            <div className="form-header-alt">
              <img src="/LogoLogitmat_sin_fondo.png" alt="Logimat Logo" className="form-brand-logo" />
              <h2>RECUPERAR</h2>
              <p className="main-message">Ingresa tu correo para recibir las instrucciones de recuperación</p>
            </div>

            <div className="login-form-fields-new">
              <div className="input-group">
                <Input 
                  placeholder="Correo electrónico" 
                  className="input-field-alt"
                />
              </div>

              <div className="form-actions-alt">
                <Button 
                  text="ENVIAR" 
                  className="btn-login-alt"
                />
              </div>
            </div>

            <div className="form-footer">
              <span>¿Recordaste tu contraseña? <Link text="regresar" href="/" className="signup-link" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};