import React from 'react';
import Head from 'next/head';
import { useIntl } from 'react-intl';

// Components
import Link from '../../../component/Link';

import style from './style';

const Header = () => {
  const i18n = useIntl();

  const links = [
    {
      title: i18n.formatMessage({ id: 'navbar.home' }),
      to: '/',
    },
    {
      title: i18n.formatMessage({ id: 'navbar.contact' }),
      to: '/contact',
    },
    {
      title: i18n.formatMessage({ id: 'navbar.about' }),
      to: '/about',
    },
  ];

  return (
    <>
      <Head>
        <title>{i18n.formatMessage({ id: 'legal.brand' })}</title>
      </Head>

      <style.Wrapper>
        <nav className="flex items-center">
          {/* Logo and Branding */}
          <style.Brand>
            <Link to="/">
              <span className="font-semibold uppercase">
                {i18n.formatMessage({ id: 'legal.brand' })}
              </span>
            </Link>
          </style.Brand>

          {/* Primary Navigation */}
          <style.Navigation>
            {links.map((link, index) => (
              <li key={'link-' + index}>
                <Link
                  to={link.to}
                  className="inline-block py-2 pr-4 pl-3 text-gray-700 hover:text-gray-500"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </style.Navigation>

          <ul className="flex ml-5">
            <li>
              <Link
                to="/"
                target="_blank"
                className="inline-block py-1 px-3 rounded text-sm bg-gray-600 text-white hover:bg-gray-700"
              >
                {i18n.formatMessage({ id: 'resume.download' })}
              </Link>
            </li>
          </ul>
        </nav>
      </style.Wrapper>
    </>
  );
};

export default Header;
