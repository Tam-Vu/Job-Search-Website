const nodemailer = require("nodemailer");
require("dotenv").config();
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const username = process.env.EMAIL_USERNAME;
const password = process.env.EMAIL_PASSWORD;
class EmailService {
    sendCustomEmail = async(to, subject, title, content) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: username,
                pass: password,
            },
        });
        const templatePath = path.join(__dirname, 'TemplateEmail.ejs');
        const template = fs.readFileSync(templatePath, 'utf-8');
        const html = ejs.render(template, { Title: title, Content: content });
        
        await transporter.sendMail({
            from: username,
            to,
            subject,
            html
        });
    }

    sendAcceptedApplicationEmail = async(to, jobTitle, companyName) => {
        const subject = "Thông báo ứng tuyển!!!";
        const text = "Chúc mừng, bạn đã ứng tuyển thành công vào vị trí " + jobTitle + " của công ty " + companyName + "!!!";
        await this.sendCustomEmail(to, subject, "XIN CHÚC MỪNG",text);
    }

    sendRejectedApplicationEmail = async(to, jobTitle, companyName) => {
        const subject = "Thông báo ứng tuyển!!!";
        const text = "Chúng tôi rất tiếc phải thông báo, đơn ứng tuyển của bạn không phù hợp để vào vị trí " + jobTitle + " của công ty " + companyName + ". Hãy tiếp tục cố gắng nhé!!!";
        await this.sendCustomEmail(to, subject, "CỐ LÊN NHÉ", text);
    }
}
module.exports = new EmailService();