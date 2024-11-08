import express from 'express'
import {forgotPassword, form_login, form_register, register, confirmCount} from '../controllers/userController.js'

const router = express.Router()

router.get('/form-login', form_login )
router.get('/form-register', form_register)
router.post('/register', register)
router.get('/confirm-count/:token', confirmCount)
router.get('/forgot-password', forgotPassword)

export default router