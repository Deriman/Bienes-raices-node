import bcrypt from 'bcrypt'
const users = [
    {
        name: 'Jose Carlos',
        email: 'zderimanz@gmail.com',
        confirm: 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default users