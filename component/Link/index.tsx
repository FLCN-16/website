import React from 'react';
import NextLink from 'next/link';

interface LinkProps extends React.HTMLProps<HTMLAnchorElement> {
  to: string;
  children: JSX.Element | JSX.Element[] | string;
}

const Link = ({ to, children, ...props }: LinkProps) => {
  return (
    <NextLink href={to}>
      <a {...props}>{children}</a>
    </NextLink>
  );
};

export default Link;
