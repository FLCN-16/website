import type { NextPage } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

// Containers
import Layout from '../container/Layout';

// Components
import HeroHeader from '../component/HeroHeader';

const Home: NextPage = () => {
  const i18n = useIntl();

  return (
    <>
      <Head>
        <title>{i18n.formatMessage({ id: 'page.home.title' })}</title>
      </Head>

      <Layout sticky={true}>
        <HeroHeader />
      </Layout>
    </>
  );
};

export default Home;
