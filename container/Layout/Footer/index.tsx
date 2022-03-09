import React from 'react';
import { FormattedMessage } from 'react-intl';

// Components
import Link from '../../../component/Link';

import style from './style';

const Footer = () => {
  return (
    <style.Wrapper>
      <div className="bg-gray-800 pt-24 pb-16">
        <div className="flex container mx-auto">
          <div className="md:w-1/4 px-2">
            <h3 className="block leading-none text-3xl font-bold uppercase">
              <FormattedMessage id="legal.brand" />
            </h3>
            <span className="block text-sm text-gray-400">
              We Build, World Use
            </span>
          </div>
          <div className="md:w-1/4 px-2">here</div>
          <div className="md:w-1/4 px-2">
            <h3 className="block leading-none text-xl font-bold uppercase">
              <FormattedMessage id="text.quick-link" />
            </h3>
          </div>
          <div className="md:w-1/4 px-2">
            <h3 className="block leading-none text-xl font-bold uppercase">
              <FormattedMessage id="text.company" />
            </h3>

            <ul className="flex flex-col mt-3">
              <li>
                <Link to="/legal/terms" className="text-gray-400">
                  <FormattedMessage id="legal.text.terms" />
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy-policy" className="text-gray-400">
                  <FormattedMessage id="legal.text.privacy-policy" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400">
                  <FormattedMessage id="text.about" />
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
