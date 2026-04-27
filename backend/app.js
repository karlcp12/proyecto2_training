// app.js (Fragmento actualizado)
import express from 'express'
import cors from 'cors'
// importaciones 
import aprendizRouter from './routes/aprendizRouter.js'
import usuarioRouter from './routes/usuariosRouter.js'
import instructorRouter from './routes/instructorRouter.js'
import centrosRouter from './routes/centrosRouter.js'
import rolesRouter from './routes/rolesRouter.js'
import programaRouter from './routes/programaRouter.js'
import fichasRouter from './routes/fichasRouter.js'
import materialesRouter from './routes/materialesRouter.js'
import solicitudesRouter from './routes/solicitudesRouter.js'
import prestamosRouter from './routes/prestamosRouter.js'
import areaMaterialesRouter from './routes/areaMaterialesRouter.js'
import devolucionesRouter from './routes/devolucionesRouter.js'
import detallePrestamoRouter from './routes/detallePrestamoRouter.js'
import statsRouter from './routes/statsRouter.js'
import bodegaRouter from './routes/bodegaRouter.js'
import categoriaRouter from './routes/categoriaRouter.js'
import sedesRouter from './routes/sedesRouter.js'
import areaRouter from './routes/areaRouter.js'
import movimientoRouter from './routes/movimientoRouter.js'
import asignaRouter from './routes/asignaRouter.js'

const app = express();

app.use(express.json())
app.use(cors())

// rutas
app.use('/usuarios', usuarioRouter) // Usuarios ruta abierta para el login

import { authMiddleware } from './middleware/authMiddleware.js';
app.use(authMiddleware);

app.use('/aprendices', aprendizRouter)
app.use('/instructores', instructorRouter)
app.use('/centros', centrosRouter)
app.use('/centros', areaMaterialesRouter)
app.use('/roles', rolesRouter)
app.use('/programas', programaRouter)
app.use('/fichas', fichasRouter)
app.use('/materiales', materialesRouter)
app.use('/solicitudes', solicitudesRouter)
app.use('/prestamos', prestamosRouter)
app.use('/devoluciones', devolucionesRouter)
app.use('/detalle-prestamo', detallePrestamoRouter)
app.use('/stats', statsRouter)
app.use('/bodega', bodegaRouter)
app.use('/categoria', categoriaRouter)
app.use('/sedes', sedesRouter)
app.use('/area', areaRouter)
app.use('/movimiento', movimientoRouter)
app.use('/asigna', asignaRouter)


app.listen(3001)
console.log('Servidor corriendo en el puerto 3001')