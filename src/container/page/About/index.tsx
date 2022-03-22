import React from 'react';
import { useIntl } from 'react-intl';

// Components
import PageTitle from '../../../component/PageTitle';

import style from './style';

const About = () => {
  const i18n = useIntl();

  return (
    <style.Wrapper>
      <PageTitle>{i18n.formatMessage({ id: 'text.about' })}</PageTitle>
    </style.Wrapper>
  );
};

export default About;
