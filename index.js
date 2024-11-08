import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import csurf from 'csurf'
import usersRoutes  from './routes/usersRoutes.js'
import db from './config/db.js'

const app = express()
dotenv.config()

try {
    await db.authenticate();
    db.sync();
    console.log('Conexión exitosa a DB')
} catch (error) {
    console.log(error)
}

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(csurf({ cookie: true }))

const port = process.env.PORT || 3000

app.use('/auth', usersRoutes )

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})