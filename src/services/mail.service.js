import config from "../config/config.js";
import nodemailer from 'nodemailer'

export default class MailingService{

    
constructor(){
    this.client = nodemailer.createTransport({
        service: config.MAIL_SERVICE || 'gmail',
        port: 587,
        auth:{
            user: 'lioilucas75@gmail.com',
            pass: 'cymp mbve objw okby'
        }

    })
}

async sendMail({from, to, subject, html, attachments = []}){
const mailOptions = {
        from, 
        to,
        subject,
        html,
        attachments
};

    const result = await this.client.sendMail(mailOptions)
    console.log(result);
    return result;
}

}