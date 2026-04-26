// app.js (Fragmento actualizado)
import express from 'express'
import cors from 'cors'
// importaciones
import aprendizRouter from './router/aprendizRouter.js'
import usuarioRouter from './router/usuariosRouter.js'
import instructorRouter from './router/instructorRouter.js'
import centrosRouter from './router/centrosRouter.js'
import rolesRouter from './router/rolesRouter.js'
import programaRouter from './router/programaRouter.js'
import fichasRouter from './router/fichasRouter.js'
import bodegaRouter from './router/bodegaRouter.js'
import solicitudesRouter from './router/solicitudesRouter.js'
import prestamosRouter from './router/prestamosRouter.js'
import devolucionesRouter from './router/devolucionesRouter.js'
import detallePrestamoRouter from './router/detallePrestamoRouter.js'
import authRouter from './router/authRouter.js'
import statsRouter from './router/statsRouter.js'
import auditRouter from './router/auditRouter.js'

const app = express();

app.use(express.json())
app.use(cors())

// Middleware manual para asegurar que las cabeceras personalizadas pasen
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-User-Action');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // Si es una petición preflight (OPTIONS), respondemos OK de una vez
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// rutas
app.use('/aprendices', aprendizRouter)
app.use('/usuarios', usuarioRouter)
app.use('/instructores', instructorRouter)
app.use('/areas', centrosRouter)
app.use('/roles', rolesRouter)
app.use('/programas', programaRouter)
app.use('/fichas', fichasRouter)
app.use('/bodega', bodegaRouter)
app.use('/solicitudes', solicitudesRouter)
app.use('/prestamos', prestamosRouter)
app.use('/devoluciones', devolucionesRouter)
app.use('/detalle-prestamo', detallePrestamoRouter)
app.use('/auth', authRouter)
app.use('/stats', statsRouter)
app.use('/audit', auditRouter)

// Tarea de limpieza automática de auditoría (cada 24 horas)
// Se ejecuta cada 12 horas para asegurar que no pase mucho tiempo
setInterval(async () => {
    try {
        const { pool } = await import('./db.js');
        const [result] = await pool.execute("DELETE FROM audit_logs WHERE fecha < DATE_SUB(NOW(), INTERVAL 24 HOUR)");
        console.log(`[LIMPIEZA] Se eliminaron ${result.affectedRows} registros de auditoría antiguos.`);
    } catch (err) {
        console.error('[LIMPIEZA ERROR]', err);
    }
}, 1000 * 60 * 60 * 12); // Cada 12 horas

app.listen(3001)
console.log('Servidor corriendo en el puerto 3001')