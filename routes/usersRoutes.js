import express from 'express'
import {forgotPassword, form_login, form_register, register, confirmCount, resetPassword} from '../controllers/userController.js'

const router = express.Router()

router.get('/form-login', form_login )
router.get('/form-register', form_register)
router.post('/register', register)
router.get('/confirm-count/:token', confirmCount)
router.get('/forgot-password', forgotPassword)
router.post('/forgot-password', resetPassword)

export default router