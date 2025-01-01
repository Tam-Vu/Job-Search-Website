const nodemailer = require("nodemailer");
require("dotenv").config();
const username = process.env.EMAIL_USERNAME;
const password = process.env.EMAIL_PASSWORD;
class EmailService {
    sendCustomEmail = async(to, subject, text) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: username,
              pass: password,
            },
          });

        await transporter.sendMail({
            from: username,
            to,
            subject,
            text
        });
    }

    sendAcceptedApplicationEmail = async(to, jobTitle, companyName) => {
        const subject = "Thông báo ứng tuyển!!!";
        const text = "Chúc mừng, bạn đã ứng tuyển thành công vào vị trí " + jobTitle + " của công ty " + companyName + "!!!";
        await this.sendCustomEmail(to, subject, text);
    }

    sendRejectedApplicationEmail = async(to, jobTitle, companyName) => {
        const subject = "Thông báo ứng tuyển!!!";
        const text = "Chúng tôi rất tiếc phải thông báo, đơn ứng tuyển của bạn không phù hợp để vào vị trí " + jobTitle + " của công ty " + companyName + " hãy tiếp tục cố gắng nhé!!!";
        await this.sendCustomEmail(to, subject, text);
    }
}
module.exports = new EmailService();