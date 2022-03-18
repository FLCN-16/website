import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

// Components
import Link from '../../../component/Link';

import style from './style';

interface IProps {
  sticky?: boolean;
}

const NavItem = ({ link, ...props }: any) => {
  return (
    <li {...props}>
      <Link
        to={link.to}
        className="block py-2 pr-4 pl-3 text-gray-500 hover:text-gray-700"
      >
        {link.title}
      </Link>
    </li>
  );
};

const Header = ({ sticky }: IProps) => {
  const i18n = useIntl();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
      title: i18n.formatMessage({ id: 'navbar.hire-me' }),
      to: '/hire-me',
    },
    {
      title: i18n.formatMessage({ id: 'navbar.about' }),
      to: '/about',
    },
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>{i18n.formatMessage({ id: 'legal.brand' })}</title>
      </Head>

      <style.Wrapper sticky={sticky} isScrolled={isScrolled}>
        <nav className="flex items-center">
          {/* Logo and Branding */}
          <style.Brand>
            <Link to="/">
              <span className="text-lg whitespace-nowrap font-semibold uppercase">
                {i18n.formatMessage({ id: 'legal.brand' })}
              </span>
            </Link>
          </style.Brand>

          {/* Primary Navigation */}
          <style.Navigation className="flex-row hidden md:flex">
            {links.map((link, index) => (
              <NavItem
                key={'link-' + index}
                link={link}
                className={`nav-item main-nav-item ${
                  router.route === link.to ? 'active' : ''
                }`.trim()}
              />
            ))}
          </style.Navigation>

          <ul className="flex ml-auto md:ml-5">
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

          {/* Mobile Navigation */}
          <style.MobileNavigation>
            <style.MobileNavigationMenu
              className="flex-col"
              isOpen={isMenuOpen}
            >
              {links.map((link, index) => (
                <NavItem
                  key={'link-' + index}
                  link={link}
                  className={`nav-item main-nav-item ${
                    router.route === link.to ? 'active' : ''
                  }`.trim()}
                />
              ))}
            </style.MobileNavigationMenu>

            <style.MobileNavigationToggle
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              Toggle
            </style.MobileNavigationToggle>
          </style.MobileNavigation>
        </nav>
      </style.Wrapper>
    </>
  );
};

export default Header;
