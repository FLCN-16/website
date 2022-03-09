import type { NextPage } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

const Home: NextPage = () => {
  const i18n = useIntl();

  return (
    <>
      <Head>
        <title>{i18n.formatMessage({ id: 'page.home.title' })}</title>
      </Head>
    </>
  );
};

export default Home;
