import React from "react";
import Wrapper from '../../Wrapper'
import Applocale from '../../../i18n';

interface IProps {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const ContactMail = ({ name, email, phone, message }: IProps) => {
  let i18n = Applocale.en.config;

  return {
    subject: 'The Falcon | Contact Mail',
    body: (
      <Wrapper i18n={i18n}>
        <p style={{ marginBottom: '0.75rem' }}>
          Hi, <b>{i18n.formatMessage({ id: 'legal.brand' })}</b>
        </p>
        <p style={{ marginBottom: '0.5rem' }}>
          You have a new contact request.
        </p>
        <p>
          <b>Name:</b> {name}
        </p>
        <p>
          <b>Email:</b> {email}
        </p>
        <p>
          <b>Phone:</b> {phone}
        </p>
        <p>
          <b>Message:</b> {message}
        </p>
      </Wrapper>
    ),
  };
};

export default ContactMail;