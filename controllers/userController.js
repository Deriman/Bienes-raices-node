import { check, validationResult } from 'express-validator'
import User from '../models/User.js'
import { generateId } from '../helpers/token.js'
import emailRegister from '../helpers/email.js'

const form_login = (req, res) => {
    res.render('auth/form-login', {
         pagina: "Iniciar sesión"
    })
}
const form_register = (req, res) => {
    res.render('auth/form-register', {
        pagina: "Crear Cuenta",
        csrf: req.csrfToken()
        
    })
}
const register = async (req, res) => {

    await check('name')
        .notEmpty().withMessage('El nombre es un campo requerido').run(req)
    await check('email')
        .isEmail().withMessage('Email no válido').run(req)
    await check('password')
        .isLength({ min: 6}).withMessage('El password debe contener al menos 6 caracteres').run(req)
    await check('repetir_password')
        .equals(req.body.password).withMessage('Los passwords deben ser iguales').run(req)

    let validation = validationResult(req)
    const { name, email, password } = req.body

    if (!validation.isEmpty()){
        return res.render('auth/form-register', {
            pagina: "Crear Cuenta",
            csrf: req.csrfToken(),
            errors: validation.array(),
            user: {
                name,
                email
            }
        })
    }

    const existUser = await User.findOne( { where: {email} })
    if (existUser) {
        return res.render('auth/form-register', {
            pagina: "Crear Cuenta",
            csrf: req.csrfToken(),
            errors: [{ msg: 'El email ya esta registrado'}],
            user: {
                name,
                email
            }
        })
    }
    
    const user = await User.create({
        name,
        email,
        password,
        token: generateId()
    })

    emailRegister({
        name: user.name,
        email: user.email,
        token: user.token
    })

    res.render('templates/message',{
        pagina: 'Cuenta creada correctamente',
        message: 'Hemos enviado un email de confirmación, pincha en el enlace.'
    })
}
const confirmCount = async (req, res) => {
    const token = req.params.token
    const user = await User.findOne({where:{token}})
    if (!user) {
        return res.render('auth/confirm-count', {
            pagina: 'Error al confirmar tu cuenta',
            message: 'Hubo un error al confirmar tu cuenta, intentalo de nuevo.',
            error: true
        })
    }

    user.token = ""
    user.confirm = true
    await user.save()
    res.render('auth/confirm-count', {
        pagina: 'Cuenta confirmada correctamente',
        message: 'La cuenta ha sido confirmada correctamente.',
        error: false
    })
}

const forgotPassword = (req, res) => {
    res.render('auth/forgot-password', {
        pagina: "Recupera tu acceso en Bienes Raices",
        csrf: req.csrfToken(),
        
    })
}

const resetPassword = async (req, res) => {
    await check('email')
        .isEmail().withMessage('Email no válido').run(req)

        let validation = validationResult(req)
        const { email } = req.body
    
        if (!validation.isEmpty()){
            return res.render('auth/forgot-password', {
                pagina: "Recupera tu acceso en Bienes Raices",
                csrf: req.csrfToken(),
                errors: validation.array(),
            })
        }
}

export {
    form_login, 
    form_register,
    forgotPassword,
    register,
    confirmCount,
    resetPassword
}