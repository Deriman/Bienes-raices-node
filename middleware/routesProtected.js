import jwt from "jsonwebtoken"
import { User } from '../models/index.js'

const routesProtected = async (req, res, next) => {
    
    // Verificar si hay token en las cookies
    const { token } = req.cookies
    if (!token) {
        return res.redirect('/auth/form-login')
    }
    // Comprobar el token, por el id cuando se genero y comprobamos en BD si hay usuario 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.scope('deletePassword').findByPk(decoded.id)
        // Si hay usuario en BD con ese id se lo pasamos al controller
        if (user) {
            req.user = user
        } else {
            return res.redirect('/auth/form-login')
        }
        return next()
    } catch (error) {
        return res.clearCookie('token').redirect('/auth/form-login')
    }
}

export default routesProtected