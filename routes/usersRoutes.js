import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
    res.json({
        message: 'Hola Mundo!!'
    })
})
router.get('/us', (req, res) => {
    res.json({
        message: 'Hola US!!'
    })
})

export default router