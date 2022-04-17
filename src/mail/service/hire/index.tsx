import React from 'react';
import Wrapper from '../../Wrapper';
import Applocale from '../../../i18n';

interface IProps {
  name: string;
  email: string;
  phone: string;
  website: string;
  company: string;
  position: string;
  project_name: string;
  project_budget: string;
  project_timeline: string;
  project_description: string;
  project_requirements: string;
}

const HireMail = ({
  name, email, phone, website,
  company, position, project_name,
  project_budget, project_timeline,
  project_description, project_requirements,
}: IProps) => {
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
      </Wrapper>
    ),
  };
};

export default HireMail;
