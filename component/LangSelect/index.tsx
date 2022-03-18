import React, { ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import AppLocale from '../../i18n';

const LangSelect = () => {
  const { pathname } = useRouter();
  const i18n = useIntl();

  const changeLanguage = (event: ChangeEvent) => {
    const { value } = event.target as HTMLSelectElement;
    const newPath = value !== 'en' ? `/${value}${pathname}` : pathname;

    window.location.assign(newPath);
  };

  return (
    <div>
      <select onChange={changeLanguage} value={i18n.locale.split('-')[0]}>
        {Object.keys(AppLocale).map((lang) => (
          <option key={lang} value={lang}>
            {AppLocale['en'].name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default React.memo(LangSelect);
