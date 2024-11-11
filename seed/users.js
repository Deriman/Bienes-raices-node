import bcrypt from 'bcrypt'
const users = [
    {
        name: 'Jose Carlos',
        email: 'zderimanz@gamil.com',
        confirm: 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default users