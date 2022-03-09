import React from 'react';

// Components
import Header from './Header';
import Footer from './Footer';

import style from './style';

interface ILayout extends React.HTMLProps<HTMLDivElement> {}

const Layout = ({ children }: ILayout) => {
  return (
    <style.Wrapper>
      {/* Header */}
      <Header />

      {/* Content */}
      <div className="content">{children}</div>

      {/* Footer */}
      <Footer />
    </style.Wrapper>
  );
};

export default Layout;
