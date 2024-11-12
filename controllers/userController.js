import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import { generateId, jwTokenGenerate } from '../helpers/token.js'
import {emailRegister, emailForgotPassword} from '../helpers/email.js'

const form_login = (req, res) => {
    res.render('auth/form-login', { //Vista
         pagina: "Iniciar sesión",
         csrf: req.csrfToken()
    })
}

const authenticate = async (req, res) => {
    //Validaciones
    await check('email')
        .isEmail().withMessage('Email no válido').run(req)
    await check('password')
        .notEmpty().withMessage('El password es requerido').run(req)

    let validation = validationResult(req)
    const { email, password } = req.body
    // Resultado validaciones
    if (!validation.isEmpty()){
        return res.render('auth/form-login', { //Vista
            pagina: "Iniciar sesión",
            csrf: req.csrfToken(),
            errors: validation.array(),
            
        })
    }
    // Busca email en BD
    const user = await User.findOne({ where: {email}})
    if (!user) {
        return res.render('auth/form-login', {
            pagina: "Iniciar sesión",
            csrf: req.csrfToken(),
            errors: [{ msg: 'El email no está registrado en BienesRaices.com'}],
        })
    }
    // Verifica si cuenta confirmada
    if (!user.confirm) {
        return res.render('auth/form-login', {
            pagina: "Iniciar sesión",
            csrf: req.csrfToken(),
            errors: [{ msg: 'Tu cuenta en BienesRaices.com no ha sido confirmada'}],
        })
    }
    // Verifica password con BD
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
    // Generamos token y lo guardamos en las cookies y redirecciona a la parte autenticada
    const jwToken = jwTokenGenerate({id:user.id, name:user.name})
    return res.cookie('token', jwToken, {
        httpOnly: true,
        //secure: true,
        sameSite: true
    }).redirect('/my-properties')
}

const form_register = (req, res) => {
    res.render('auth/form-register', {
        pagina: "Crear Cuenta",
        csrf: req.csrfToken()
    })
}
// Botón de crear cuenta
const register = async (req, res) => {
    // Validaciones
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
    // Resultados de la validaciones
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
    // Verifica que el email no este en BD
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
    // Guarda el usuario en BD con token 
    const user = await User.create({
        name,
        email,
        password,
        token: generateId()
    })
    // Manda un email para confirmar cuenta con nodemailer
    emailRegister({
        name: user.name,
        email: user.email,
        token: user.token
    })
    // Renderizamos una vista indicando que le hemos enviado un email para confirmar
    res.render('templates/message',{
        pagina: 'Cuenta creada correctamente',
        message: 'Hemos enviado un email de confirmación.'
    })
}

const confirmCount = async (req, res) => {
    const token = req.params.token
    //Verifica que el token este en base de datos y obtenemos el usuario
    const user = await User.findOne({where:{token}})
    if (!user) {
        return res.render('auth/confirm-count', {
            pagina: 'Error al confirmar tu cuenta',
            message: 'Hubo un error al confirmar tu cuenta, intentalo de nuevo.',
            error: true
        })
    }
    // El usuario confirma la cuenta y lo guardamos en BD
    user.token = null
    user.confirm = true
    await user.save()
    // Renderizamos que la cuenta ha sido confirmada
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
    // Valida el email
    await check('email')
        .isEmail().withMessage('Email no válido').run(req)

    let validation = validationResult(req)
    const { email } = req.body
    // Resultado del email
    if (!validation.isEmpty()){
        return res.render('auth/forgot-password', {
            pagina: "Recupera tu acceso en Bienes Raices",
            csrf: req.csrfToken(),
            errors: validation.array()
        })
    }
    // Verifica que el email esta en BD y obtenemos al usuario
    const user = await User.findOne( { where: { email }})
    if (!user){
        return res.render('auth/forgot-password', {
            pagina: "Recupera tu acceso en Bienes Raices",
            csrf: req.csrfToken(),
            errors: [{ msg: "El email no pertenece a ningún usuario registrado"}],
        })
    }
    // Se genera el token y se guarda el usuario con el token
    user.token = generateId()
    user.save()
    // Se envia correo para restablecer password 
    emailForgotPassword({
        email, 
        name: user.name,
        token: user.token
    })
    // Renderizamos una vista informando que se le ha enviado un correo
    res.render('templates/message',{
        pagina: 'Restablece tu password',
        message: 'Hemos enviado un email con las instrucciones.'
    })
}

const checkToken = async (req, res) => {
    // Verifica que existe ese usuario mediante el token
    const { token } = req.params
    const user = await User.findOne({ where: {token}})
    if (!user) {
        return res.render('auth/confirm-count', {
            pagina: 'Error al restablecer tu password',
            message: 'Hubo un error al confirmar tu información, intentalo de nuevo.',
            error: true
        })
    }
    // Se renderiza una vista para poder cambiar la password
    res.render('auth/reset-password',{
        pagina: 'Restablece tu password',
        csrf: req.csrfToken()
    })
}

const newPassword = async (req, res) => {
    // Valida la password
    await check('password')
        .isLength({ min: 6}).withMessage('El password debe contener al menos 6 caracteres').run(req)

    let validation = validationResult(req)
    // Resultado validación
    if (!validation.isEmpty()){
        return res.render('auth/reset-password', {
            pagina: 'Restablece tu password',
            csrf: req.csrfToken(),
            errors: validation.array(),
            })
    }
    // Mediante el token se busca usuario en BD para posteriormente guardarlo con la nueva password
    const { token } = req.params
    console.log(token)
    const { password } = req.body
    const user = await User.findOne( { where: { token }})
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.token = null
    await user.save()
    // Renderizamos vista con el ok de la password restablecida
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