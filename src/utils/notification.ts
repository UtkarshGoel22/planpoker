import * as nodemailer from 'nodemailer';

import { LogMessages } from '../constants/message';
import config from '../settings/config';

export const sendBulkMails = async (
  emailSubject: string,
  emailBody: string,
  receiverEmails: string[],
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
    bcc: receiverEmails,
    subject: emailSubject,
    html: emailBody,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(LogMessages.SEND_EMAIL_FAILURE, error);
    } else {
      console.log(LogMessages.SEND_EMAIL_SUCCESS, info.response);
    }
  });
};

export const sendMail = async (emailSubject: string, emailBody: string, receiverEmail: string) => {
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
    to: receiverEmail,
    subject: emailSubject,
    html: emailBody,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(LogMessages.SEND_EMAIL_FAILURE, error);
    } else {
      console.log(LogMessages.SEND_EMAIL_SUCCESS, info.response);
    }
  });
};
