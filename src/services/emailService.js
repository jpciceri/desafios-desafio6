import nodemailer from 'nodemailer';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'tuemail@gmail.com',
                pass: 'tupassword'
            }
        });
    }

    sendEmail(email) {
        const mailOptions = {
            from: 'tuemail@gmail.com',
            to: email.to,
            subject: email.subject,
            text: email.text
        };

        return this.transporter.sendMail(mailOptions);
    }
}

export default EmailService;