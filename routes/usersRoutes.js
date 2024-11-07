import express from 'express'
import {forgotPassword, form_login, form_register, register} from '../controllers/usuarioController.js'

const router = express.Router()

router.get('/form-login', form_login )
router.get('/form-register', form_register)
router.post('/register', register)
router.get('/forgot-password', forgotPassword)

export default router