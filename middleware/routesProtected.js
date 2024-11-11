import jwt from "jsonwebtoken"
import { User } from '../models/index.js'

const routesProtected = async (req, res, next) => {
    
    // Verificar si hay token
    const { _token } = req.cookies
    if (!_token) {
        return res.redirect('/auth/form-login')
    }

    // Comprobar el token
    try {
        const decoded = jwt.verify(_token, process.env.process.env.JWT_SECRET)
        const user = await User.findByPk(decoded.id)
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/form.login')
    }



    next()
}

export default routesProtected