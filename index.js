import express from 'express'
import usersRoutes  from './routes/usersRoutes.js'

const app = express()

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static('public'))

const port = 3000

app.use('/auth', usersRoutes )

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})