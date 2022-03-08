import React from 'react';
import { useIntl } from 'react-intl';

// Components
import Header from './Header';
import Footer from './Footer';

import style from './style';

const Layout = () => {
  const i18n = useIntl();

  return (
    <style.Wrapper>
      <Header />
      <Footer />
    </style.Wrapper>
  );
};

export default Layout;
