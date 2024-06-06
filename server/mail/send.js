import nodemailer from 'nodemailer'
import dotnet from 'dotenv'

dotnet.config()

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILTRAP_USER, 
        pass: process.env.MAILTRAP_PASS, 
    }
})

export default ({ to, subject, html }) => {
    var options = {
        from: `OpenAI <${process.env.MAIL_EMAIL}>`,
        to,
        subject,
        html
    }

    transporter.sendMail(options, function (err, done) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ', done?.response);
        }
    });
}