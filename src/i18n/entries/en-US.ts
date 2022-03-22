import { createIntl, createIntlCache } from 'react-intl';
import enMessages from '../locales/en_US.json';

const cache = createIntlCache();

const EnLang = createIntl(
  {
    locale: 'en-US',
    messages: {
      ...enMessages,
    },
  },
  cache
);
export default EnLang;
