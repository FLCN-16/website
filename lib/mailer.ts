import { createTransport } from 'nodemailer';

const mailer = createTransport({
  host: process.env.MAIL_HOST || '',
  port: parseInt(process.env.MAIL_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || '',
  },
});

export const sendMail = (to: string, subject: string, html: string) => {
  return mailer.sendMail({
    from: process.env.MAIL_FROM || '',
    to,
    subject,
    html,
  });
};

export default mailer;
