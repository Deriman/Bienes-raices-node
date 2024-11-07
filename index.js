import dotenv from 'dotenv'
import express from 'express'
import usersRoutes  from './routes/usersRoutes.js'
import db from './config/db.js'

dotenv.config()
const app = express()

try {
    await db.authenticate();
    console.log('Conexión exitosa a DB')
} catch (error) {
    console.log(error)
}

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static('public'))

const port = 3000

app.use('/auth', usersRoutes )

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})