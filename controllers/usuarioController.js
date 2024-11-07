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



export {
    login, 
    register
}