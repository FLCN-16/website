import type { NextPage } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

// Containers
import Layout from '../container/Layout';

// Components
import Home from '../container/page/Home';

const HomePage: NextPage = () => {
  const i18n = useIntl();

  return (
    <>
      <Head>
        <title>{i18n.formatMessage({ id: 'page.home.title' })}</title>
      </Head>

      <Layout sticky={true}>
        <Home />
      </Layout>
    </>
  );
};

export default HomePage;
