import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/atoms/Button/Button';
import './LoginForm.css';

export const LoginForm: React.FC = () => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (user === 'admin' && password === 'admin123') {
            navigate('/app');
        } else {
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <form className="login-form" onSubmit={handleLogin}>
            <h2>Iniciar Sesión</h2>
            {error && <p className="login-error" style={{ color: 'red', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}
            <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Usuario</label>
                <input
                    className="form-input"
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }}
                    placeholder="Ingresa tu usuario"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    type="text"
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Contraseña</label>
                <input
                    className="form-input"
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                />
            </div>
            <Button text="Iniciar Sesión" type="submit" />
        </form>
    );
};

export default LoginForm;