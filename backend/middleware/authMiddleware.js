import jwt from 'jsonwebtoken';

const process = { env: { JWT_SECRET: 'mi-clave-super-secreta-123' } }; // Hardcoded temporario ya que no tenemos .env

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ mensaje: 'Acceso denegado: Token no proporcionado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guardar datos del usuario
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Acceso denegado: Token inválido o expirado' });
    }
};
