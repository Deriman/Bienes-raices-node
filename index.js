import express from 'express'
import usersRoutes  from './routes/usersRoutes.js'

const app = express()

app.set('view engine', 'pug')
app.set('views', './views')

const port = 3000

app.use('/', usersRoutes )

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})