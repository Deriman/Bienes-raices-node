const login = (req, res) => {
    res.render('auth/login', {
         pagina: "Iniciar sesión"
    })
}
const register = (req, res) => {
    res.render('auth/register', {
        pagina: "Crear Cuenta"
        
    })
}
const forgotPassword = (req, res) => {
    res.render('auth/forgot-password', {
        pagina: "Recupera tu acceso en Bienes Raices"
        
    })
}



export {
    login, 
    register,
    forgotPassword
}