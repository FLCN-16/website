import React from 'react';
import { useIntl } from 'react-intl';

// Components
import PageTitle from '../../../component/PageTitle';

import style from './style';

const Portfolio = () => {
  const i18n = useIntl();

  return (
    <style.Wrapper>
      <PageTitle title={i18n.formatMessage({ id: 'text.portfolio' })} />
    </style.Wrapper>
  );
};

export default Portfolio;
