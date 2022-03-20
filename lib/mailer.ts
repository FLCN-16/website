import nodemailer from 'nodemailer';

const mailer = nodemailer.createTransport({
  host: process.env.MAIL_HOST as string,
  port: process.env.MAIL_PORT as string,
  auth: {
    user: process.env.MAIL_USER as string,
    pass: process.env.MAIL_PASS as string,
  },
});

export const sendMail = (to: string, subject: string, html: string) => {
  return mailer.sendMail({
    from: process.env.MAIL_FROM as string,
    to,
    subject,
    html,
  });
};

export default mailer;
