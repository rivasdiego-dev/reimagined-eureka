const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'recycluster@outlook.com',
        pass: 'Hola12345'
    }
});

exports.sendEmailToUser = async (email, password) => {
    let mailOptions = {
        from: 'recycluster@outlook.com',
        to: email,
        subject: 'Reestablecimiento de contraseña',
        text: `Esta es tu nueva contraseña temporal: ${password}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
