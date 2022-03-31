import { Mailer } from 'nodemailer-react';

// Templates
import ContactMail from './service/contact';


const transport = {
  host: process.env.MAIL_HOST || '',
  port: parseInt(process.env.MAIL_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || '',
  },
};

const defaults = {
  from: process.env.MAIL_FROM || '',
};

const templates = {
  ContactMail,
};

export default Mailer({ transport, defaults }, templates);