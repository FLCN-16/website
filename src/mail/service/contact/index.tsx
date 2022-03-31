import React from "react";

interface IProps {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const ContactMail = ({ name, email, phone, message }: IProps) => ({
  subject: 'Contact Subject',
  body: <div>body here</div>,
});

export default ContactMail;