import jwt from 'jsonwebtoken'

const jwTokenGenerate = datos => {
    return jwt.sign({id:datos.id, name:datos.name}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

const generateId = () => Math.random().toString(32).substring(2) + Date.now().toString(32) 

export {
    generateId,
    jwTokenGenerate
} 
    
