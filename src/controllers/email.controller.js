import Email from "../dao/models/email.model.js";
import EmailService from "../services/emailService.js";

class EmailController {
  constructor() {
    this.emailService = new EmailService();
    this.email = new Email();
  }
  async sendEmail(req, res) {
    const { to, subject, text } = req.body;
    const email = new Email(to, subject, text);

    try {
      await emailService.sendEmail(email);
      res.status(200).send("Email enviado exitosamente");
    } catch (error) {
      res.status(500).send("Hubo un error al enviar el email");
      console.error(error);
    }
  }
}

export default  EmailController;
