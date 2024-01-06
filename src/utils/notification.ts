import * as nodemailer from "nodemailer";

import config from "../settings/config";
import { LogMessages } from "../constants/message";

export const sendMail = async (
  email_subject: string,
  email_body: string,
  reciever_email: string
) => {
  const transporter = nodemailer.createTransport({
    service: config.EMAIL.SERIVCE_TYPE,
    host: config.EMAIL.HOST,
    secure: true,
    auth: {
      user: config.EMAIL.SENDER_MAIL,
      pass: config.EMAIL.SENDER_PASSWORD,
    },
  });

  const mailOptions: nodemailer.SendMailOptions = {
    from: config.EMAIL.SENDER_MAIL,
    to: reciever_email,
    subject: email_subject,
    html: email_body,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(LogMessages.SEND_EMAIL_FAILURE, error);
    } else {
      console.log(LogMessages.SEND_EMAIL_SUCCESS, info.response);
    }
  });
};
