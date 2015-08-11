var crypto = require('crypto');
var nodemailer = require('nodemailer');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var mail = config.mail;
var mailtpl = require('../../config/mailtpl');

function genVerifyLink(userId) {
    var md5 = crypto.createHash('md5');
    var sign = md5.update(config.sessionSecret + userId).digest('hex');
    return config.web + '/users/' + userId + '/verify?confirm_token=' + sign;
}

exports.sendVerifyEmail = function(toEmail, userId, callback) {

    var transporter = nodemailer.createTransport({
        service: mail.service,
        auth: {
            user: mail.account,
            pass: mail.password
        }
    });

    var verifyLink = genVerifyLink(userId);

    var mailOptions = {
        from: mailtpl.from,
        to: toEmail,
        subject: mailtpl.subject,
        text: mailtpl.prefixText + verifyLink + mailtpl.suffixText
    };

    transporter.sendMail(mailOptions, callback);
};
