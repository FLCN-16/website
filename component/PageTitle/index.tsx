import React from 'react';

import style from './style';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {}

const PageTitle: React.FC<IProps> = ({ children }) => {
  return (
    <style.Wrapper className="text-center py-12 md:py-24">
      <h1 className="text-3xl md:text-6xl">{children}</h1>
    </style.Wrapper>
  );
};

export default PageTitle;
