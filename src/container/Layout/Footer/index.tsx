import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

// Components
import Link from '../../../component/Link';

import style from './style';

const Footer = () => {
  const i18n = useIntl();

  const links = [
    {
      title: i18n.formatMessage({ id: 'footer.nav.portfolio' }),
      to: '/portfolio',
    },
    {
      title: i18n.formatMessage({ id: 'footer.nav.contact' }),
      to: '/contact',
    },
    {
      title: i18n.formatMessage({ id: 'footer.nav.hire-me' }),
      to: '/hire-me',
    },
    {
      title: i18n.formatMessage({ id: 'footer.nav.about' }),
      to: '/',
    },
  ];

  return (
    <style.Wrapper>
      <div className="bg-gray-800 pt-24 pb-16">
        <div className="flex container px-5 flex-col md:flex-row mx-auto">
          <div className="md:w-1/4 px-2 mb-8 md:mb-0">
            <h3 className="block leading-none text-3xl font-bold uppercase">
              <FormattedMessage id="legal.brand" />
            </h3>
            <span className="block text-sm text-gray-400 hover:text-gray-500">
              <FormattedMessage id="legal.tagline" />
            </span>
          </div>

          <div className="md:w-1/4 px-2 mb-8 md:mb-0">
            <h3 className="block leading-none text-xl font-bold uppercase">
              <FormattedMessage id="text.quick-link" />
            </h3>

            <ul className="flex flex-col mt-3">
              {links.map((link, index) => (
                <li key={'link-' + index}>
                  <Link to={link.to} className="inline-block text-gray-400 hover:text-gray-500">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:w-1/4 px-2 mb-8 md:mb-0">
            <h3 className="block leading-none text-xl font-bold uppercase">
              <FormattedMessage id="text.find-online" />
            </h3>

            <ul className="flex flex-col mt-3">
              <li>
                <Link
                  to="https://twitter.com/flcn_16"
                  target="_blank"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FormattedMessage id="social.twitter" />
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.facebook.com/FLCN16/"
                  target="_blank"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FormattedMessage id="social.facebook" />
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.instagram.com/flcn16/"
                  target="_blank"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FormattedMessage id="social.instagram" />
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.linkedin.com/in/flcn16/"
                  target="_blank"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FormattedMessage id="social.linkedin" />
                </Link>
              </li>
              <li>
                <Link
                  to="https://github.com/FLCN-16"
                  target="_blank"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FormattedMessage id="social.github" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:w-1/4 px-2">
            <h3 className="block leading-none text-xl font-bold uppercase">
              <FormattedMessage id="footer.nav.title.legal" />
            </h3>

            <ul className="flex flex-col mt-3">
              <li>
                <Link to="/legal/terms" className="text-gray-400 hover:text-gray-500">
                  <FormattedMessage id="legal.text.terms" />
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy-policy" className="text-gray-400 hover:text-gray-500">
                  <FormattedMessage id="legal.text.privacy-policy" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-center bg-gray-900 py-2 px-5">
        <span className="text-white text-sm">
          <FormattedMessage id="legal.copyright" />
        </span>
      </div>
    </style.Wrapper>
  );
};

export default Footer;
