import React from 'react';
import { useIntl } from 'react-intl';

// Components
import PageTitle from '../../../component/PageTitle';

import style from './style';

const HireMe = () => {
  const i18n = useIntl();

  return (
    <style.Wrapper>
      <PageTitle>{i18n.formatMessage({ id: 'text.hire-me' })}</PageTitle>

      <section className="bg-gray-100">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4"></div>
          </div>
        </div>
      </section>
    </style.Wrapper>
  );
};

export default HireMe;
