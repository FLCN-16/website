import React from 'react';

import style from './style';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
}

const PageTitle: React.FC<IProps> = ({ title, subtitle }) => {
  return (
    <style.Wrapper className="text-center py-12 md:py-24">
      <h1 className="text-3xl md:text-6xl mb-2">{title}</h1>
      {subtitle && <p className="text-lg text-gray-200">{subtitle}</p>}
    </style.Wrapper>
  );
};

export default PageTitle;
