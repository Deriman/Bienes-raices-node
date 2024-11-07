const form_login = (req, res) => {
    res.render('auth/form-login', {
         pagina: "Iniciar sesión"
    })
}
const form_register = (req, res) => {
    res.render('auth/form-register', {
        pagina: "Crear Cuenta"
        
    })
}
const register = (req, res) => {
    console.log("Registrando....")
        
}
const forgotPassword = (req, res) => {
    res.render('auth/forgot-password', {
        pagina: "Recupera tu acceso en Bienes Raices"
        
    })
}



export {
    form_login, 
    form_register,
    forgotPassword,
    register
}