import type { AppProps } from 'next/app';
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// State
import { useDispatch } from 'react-redux';
import { initialize } from '../redux/app/actions';

// Internationlization
import { IntlProvider } from 'react-intl';
import AppLocale from '../i18n';

import { wrapper } from '../redux';

export interface AppProviderProps {
  children: JSX.Element | JSX.Element[];
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { locale, pathname } = useRouter();
  const dispatch = useDispatch();

  const isAdmin = !!pathname.match(/^\/admin\/?/);

  const shortLocale = locale ? locale.split('-')[0] : 'en';
  const currentAppLocale = AppLocale['en'];

  if (!isAdmin) {
    require('../styles/tailwind.css');
  }

  React.useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  return (
    <React.Fragment>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
      >
        <Head>
          <title>
            {currentAppLocale.formatMessage({ id: 'page.home.title' })}
          </title>
        </Head>
        {children}
      </IntlProvider>
    </React.Fragment>
  );
};

const AppProviderComponent = wrapper.withRedux(AppProvider);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProviderComponent>
      <Component {...pageProps} />
    </AppProviderComponent>
  );
}

export default MyApp;
