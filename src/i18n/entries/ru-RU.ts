import { createIntl, createIntlCache } from 'react-intl';
import ruMessages from '../locales/ru_RU.json';

const cache = createIntlCache();

const RuLang = createIntl(
  {
    locale: 'ru-RU',
    messages: {
      ...ruMessages,
    },
  },
  cache
);
export default RuLang;
