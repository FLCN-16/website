import type { NextPage } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

// Containers
import Layout from '../container/Layout';

const PortfolioPage: NextPage = () => {
  const i18n = useIntl();

  return (
    <>
      <Head>
        <title>{i18n.formatMessage({ id: 'page.home.title' })}</title>
      </Head>

      <Layout></Layout>
    </>
  );
};

export default PortfolioPage;
