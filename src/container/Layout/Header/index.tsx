import React from 'react';
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
        className="block py-2 pr-4 pl-3 font-semibold text-gray-800 hover:text-gray-900"
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
      title: i18n.formatMessage({ id: 'navbar.portfolio' }),
      to: '/portfolio',
    },
    {
      title: i18n.formatMessage({ id: 'navbar.about' }),
      to: '/about',
    },
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 25);
    };

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style.Wrapper sticky={sticky} isScrolled={isScrolled}>
        <nav className="flex container mx-auto items-center">
          {/* Logo and Branding */}
          <style.Brand>
            <Link to="/">
              <span className="text-lg whitespace-nowrap font-bold uppercase">
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

          <ul className="ml-auto md:ml-5 gap-x-1 hidden md:flex">
            <li>
              <Link
                to="/assets/files/Resume.pdf"
                target="_blank"
                download="Rishabh's-curriculum-vitae"
                className="inline-block py-2 px-4 rounded text-sm font-semibold bg-gray-600 text-white drop-shadow-xl hover:drop-shadow-none transition-all duration-300"
              >
                {i18n.formatMessage({ id: 'resume.download' })}
              </Link>
            </li>
          </ul>

          {/* Mobile Navigation */}
          <style.MobileNavigation className="md:hidden ml-auto">
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
                  onClick={() => setIsMenuOpen(false)}
                />
              ))}
              <li className="flex nav-item main-nav-item py-2 pr-4 pl-3 gap-x-1">
                <Link
                  to="/assets/files/Resume.pdf"
                  target="_blank"
                  download="Rishabh's-curriculum-vitae"
                  className="inline-block flex-1 py-2 px-4 rounded text-sm text-center font-semibold bg-gray-600 text-white drop-shadow-xl hover:drop-shadow-none transition-all duration-300"
                >
                  {i18n.formatMessage({ id: 'resume.download' })}
                </Link>
              </li>
            </style.MobileNavigationMenu>

            <style.MobileNavigationToggle
              className="flex md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i></i>
              <i></i>
              <i></i>
            </style.MobileNavigationToggle>
          </style.MobileNavigation>
        </nav>
      </style.Wrapper>
    </>
  );
};

export default Header;
