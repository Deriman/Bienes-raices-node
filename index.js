import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import csurf from 'csurf'
import usersRoutes  from './routes/usersRoutes.js'
import propertiesRoutes from './routes/propertiesRoutes.js'
import db from './config/db.js'
// Variables de entorno, a dia de hoy se puede hacer de otra manera sin necesidad de instalar dotenv
dotenv.config()
const app = express()
// Conexión BD mysql
try {
    await db.authenticate();
    db.sync();
} catch (error) {
    console.log(error)
}
// Motor de plantillas 
app.set('view engine', 'pug')
app.set('views', './views')
// Carpeta pública del proyecto
app.use(express.static('public'))
// Habilitar los formularios
app.use(express.urlencoded({extended: true}))
// Habilitar escribir cookie
app.use(cookieParser())
// Evitar el CSF
app.use(csurf({ cookie: true }))

const port = process.env.PORT || 3000
// Rutas de la aplicación
app.use('/auth', usersRoutes )
app.use('/', propertiesRoutes)
// Servidor escuchando
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})