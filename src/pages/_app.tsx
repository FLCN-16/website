import type { AppProps } from 'next/app';
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';

// State
import { useDispatch } from 'react-redux';
import { initialize } from '../redux/app/actions';

// Internationlization
import { IntlProvider } from 'react-intl';
import AppLocale from '../i18n';

import { wrapper } from '../redux';

import '../styles/globals.css';

export interface AppProviderProps {
  children: JSX.Element | JSX.Element[];
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { locale, pathname } = useRouter();
  const dispatch = useDispatch();

  const isAdmin = !!pathname.match(/^\/admin\/?/);

  const shortLocale = locale ? locale.split('-')[0] : 'en';
  const currentAppLocale = AppLocale['en'].config;

  if (!isAdmin) require('../styles/tailwind.css');

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

          <meta
            name="viewpoint"
            content="width=device-width, initial-scale=1"
          />
        </Head>
        {children}
      </IntlProvider>
    </React.Fragment>
  );
};

const AppProviderComponent = wrapper.withRedux(AppProvider);

function MyApp({ Component, pageProps, router }: AppProps) {
  React.useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  return (
    <AppProviderComponent>
      <AnimatePresence
        initial={false}
        exitBeforeEnter={true}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
    </AppProviderComponent>
  );
}

export default MyApp;
