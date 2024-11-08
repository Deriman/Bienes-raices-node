import nodemailer from 'nodemailer'

const emailRegister = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

    const { name, email, token } = data

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
            <p>Hola ${name}, comprueba tu cuenta en BienesRaices.com</p>

            <p>Tu cuenta ya esta casi lista, solo debes confirmarla en el siguiente enlace:
            <a href="${process.env.BACKEND_URI}:${process.env.PORT ?? 3000}/auth/confirm-count/${token}">Confirmar cuenta</a></p>

            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
}

export default emailRegister