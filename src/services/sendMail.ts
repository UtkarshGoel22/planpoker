import nodeMailer from 'nodemailer';

export type SendMail = {
  to: string;
  message: string;
  subject: string;
};

export type SendMassMails = {
  to: string[];
  message: string;
  subject: string;
};

export const sendMail = async (details: SendMail) => {
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions: nodeMailer.SendMailOptions = {
    from: process.env.EMAIL,
    to: details.to,
    subject: details.subject,
    html: details.message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

export const sendMassMails = async (details: SendMassMails) => {
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions: nodeMailer.SendMailOptions = {
    from: process.env.EMAIL,
    bcc: details.to,
    subject: details.subject,
    html: details.message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
