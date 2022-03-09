import React from 'react';
import { useIntl } from 'react-intl';

import style from './style';

const Footer = () => {
  const i18n = useIntl();

  return (
    <style.Wrapper>
      <div className="bg-gray-800 pt-24 pb-16"></div>

      {/* Bottom Bar */}
      <div className="flex justify-center bg-gray-900 py-2 px-5">
        <span className="text-white text-sm">
          {i18n.formatMessage({ id: 'legal.copyright' })}
        </span>
      </div>
    </style.Wrapper>
  );
};

export default Footer;
