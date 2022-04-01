import React from "react";

interface IProps {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const ContactMail = ({ name, email, phone, message }: IProps) => ({
  subject: 'The Falcon | Contact Mail',
  body: (
    <div>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
      <p>Message: {message}</p>
    </div>
  ),
});

export default ContactMail;