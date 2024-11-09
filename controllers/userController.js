import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { generateId } from '../helpers/token.js'
import {emailRegister, emailForgotPassword} from '../helpers/email.js'

const form_login = (req, res) => {
    res.render('auth/form-login', {
         pagina: "Iniciar sesión",
         csrf: req.csrfToken()
    })
}

const authenticate = async (req, res) => {
    await check('email')
        .isEmail().withMessage('Email no válido').run(req)
    await check('password')
        .notEmpty().withMessage('El password es requerido').run(req)

    let validation = validationResult(req)
    const { email, password } = req.body
    
    if (!validation.isEmpty()){
        return res.render('auth/form-login', {
            pagina: "Iniciar sesión",
            csrf: req.csrfToken(),
            errors: validation.array(),
            
        })
    }

    const user = await User.findOne({ where: {email}})
    if (!user) {
        return res.render('auth/form-login', {
            pagina: "Iniciar sesión",
            csrf: req.csrfToken(),
            errors: [{ msg: 'El email no está registrado en BienesRaices.com'}],
        })
    }

    if (!user.confirm) {
        return res.render('auth/form-login', {
            pagina: "Iniciar sesión",
            csrf: req.csrfToken(),
            errors: [{ msg: 'Tu cuenta en BienesRaices.com no ha sido confirmada'}],
        })
    }

    if (!user.verificatePassword(password)) {
        return res.render('auth/form-login', {
            pagina: "Iniciar sesión",
            csrf: req.csrfToken(),
            errors: [{ msg: 'La password no es correcta'}],
            user: {
                email
            }
        })
    }

    const jwToken = jwt.sign({
        name: 'Deriman',
        equipo: 'CaiGC',
        prueba: 3000
    }, "palabrasupersecretaaaa", {
        expiresIn: '1d'
    })

    console.log({jwToken})
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
        message: 'Hemos enviado un email de confirmación.'
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

    user.token = null
    user.confirm = true
    await user.save()

    res.render('auth/confirm-count', {
        pagina: 'Cuenta confirmada correctamente',
        message: 'La cuenta ha sido confirmada correctamente.'
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
            errors: validation.array()
        })
    }

    const user = await User.findOne( { where: { email }})
    if (!user){
        return res.render('auth/forgot-password', {
            pagina: "Recupera tu acceso en Bienes Raices",
            csrf: req.csrfToken(),
            errors: [{ msg: "El email no pertenece a ningún usuario registrado"}],
        })
    }

    user.token = generateId()
    user.save()

    emailForgotPassword({
        email, 
        name: user.name,
        token: user.token
    })

    res.render('templates/message',{
        pagina: 'Restablece tu password',
        message: 'Hemos enviado un email con las instrucciones.'
    })
}

const checkToken = async (req, res) => {
    const { token } = req.params
    const user = await User.findOne({ where: {token}})
    if (!user) {
        return res.render('auth/confirm-count', {
            pagina: 'Error al restablecer tu password',
            message: 'Hubo un error al confirmar tu información, intentalo de nuevo.',
            error: true
        })
    }

    res.render('auth/reset-password',{
        pagina: 'Restablece tu password',
        csrf: req.csrfToken()
    })
}


const newPassword = async (req, res) => {
    await check('password')
        .isLength({ min: 6}).withMessage('El password debe contener al menos 6 caracteres').run(req)

    let validation = validationResult(req)
    
    if (!validation.isEmpty()){
        return res.render('auth/reset-password', {
            pagina: 'Restablece tu password',
            csrf: req.csrfToken(),
            errors: validation.array(),
            })
    }
    const { token } = req.params
    const { password } = req.body
    const user = await User.findOne( { where: { token }})
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.token = ''
    await user.save()

    res.render('auth/confirm-count', {
        pagina: 'Password restablecido.',
        message: 'Se ha restablecido la password con exito.',
        error: false
    })
}

export {
    form_login, 
    form_register,
    forgotPassword,
    register,
    confirmCount,
    resetPassword,
    checkToken,
    newPassword, 
    authenticate
}