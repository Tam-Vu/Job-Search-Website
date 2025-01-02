const nodemailer = require("nodemailer");
require("dotenv").config();
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
import { formatDate } from '../utils/valiation';

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
        const text = "Chúc mừng, bạn đã ứng tuyển thành công vào vị trí " + jobTitle + " của công ty " + companyName + ". Hãy đợi công ty lên lịch phỏng vấn nhé!!!";
        await this.sendCustomEmail(to, subject, "XIN CHÚC MỪNG",text);
    }

    sendRejectedApplicationEmail = async(to, jobTitle, companyName) => {
        const subject = "Thông báo ứng tuyển!!!";
        const text = "Chúng tôi rất tiếc phải thông báo, đơn ứng tuyển của bạn không phù hợp để vào vị trí " + jobTitle + " của công ty " + companyName + ". Hãy tiếp tục cố gắng nhé!!!";
        await this.sendCustomEmail(to, subject, "CỐ LÊN NHÉ", text);
    }

    sendInterviewScheduleEmail = async(to, jobTitle, companyName, location, date, time) => {
        const subject = "Thông báo lịch phỏng vấn!!!";
        const text = "Chúng tôi xin thông báo bạn đã được chọn để tham gia phỏng vấn vào vị trí " + jobTitle + " của công ty " + companyName + " tại " + location + " vào lúc " + time + " ngày " + formatDate(date) + ". Hãy chắc chắn bạn sẽ có mặt đúng giờ nhé!!!";
        await this.sendCustomEmail(to, subject, "LỊCH PHỎNG VẤN", text);
    }

    sendCompletedInterviewScheduleEmail = async(to, jobTitle, companyName, location) => {
        const currentDate  = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const date = `${day}-${month}-${year}`;
        const time = `${hours}:${minutes}`;
        const subject = "Thông báo lịch phỏng vấn!!!";
        const text = "Chúng tôi xin thông báo bạn hoàn thành buổi phỏng vấn vào vị trí " + jobTitle + " của công ty " + companyName + " tại " + location + " vào lúc " + time + " ngày " + date + ". Bạn vui lòng chờ kết quả phỏng vấn nhé. Chúc bạn may mắn!!!";
        await this.sendCustomEmail(to, subject, "LỊCH PHỎNG VẤN", text);
    }

    sendCanceledInterviewScheduleEmail = async(to, jobTitle, companyName, location, date, time) => {
        const subject = "Thông báo lịch phỏng vấn!!!";
        const text = "Chúng tôi xin thông báo: buổi phỏng vấn vào vị trí " + jobTitle + " của công ty " + companyName + " tại " + location + " vào lúc " + time + " ngày " + formatDate(date) + " đã bị hủy. Bạn vui lòng chờ thông báo tiếp theo nhé!!!";
        await this.sendCustomEmail(to, subject, "LỊCH PHỎNG VẤN", text);
    }
}
module.exports = new EmailService();