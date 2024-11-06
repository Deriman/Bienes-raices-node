const login = (req, res) => {
    res.render('auth/login', {
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