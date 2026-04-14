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

const app = express();

app.use(express.json())
app.use(cors())

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

app.listen(3001)
console.log('Servidor corriendo en el puerto 3001')