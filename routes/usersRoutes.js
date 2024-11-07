import express from 'express'
import {forgotPassword, login, register} from '../controllers/usuarioController.js'

const router = express.Router()

router.get('/login', login )
router.get('/register', register)
router.get('/forgot-password', forgotPassword)
export default router