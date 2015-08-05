var nodemailer = require('nodemailer');
var env = process.env.NODE_ENV || 'development';
var mail = require('../../config/config')[env].mail;
var mailtpl = require('../../config/mailtpl');

exports.sendVerifyEmail = function (toEmail, verifyLink, callback) {

    var transporter = nodemailer.createTransport({
        service: mail.service,
        auth: {
            user: mail.account,
            pass: mail.password
        }
    });

    var mailOptions = {
        from: mailtpl.from,
        to: toEmail,
        subject: mailtpl.subject,
        text: mailtpl.prefixText + verifyLink + mailtpl.suffixText
    };

    transporter.sendMail(mailOptions, callback);

}
