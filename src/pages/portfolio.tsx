import type { NextPage } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

// Containers
import Layout from '../container/Layout';
import Portfolio from '../container/page/Portfolio';

const PortfolioPage: NextPage = () => {
  const i18n = useIntl();

  return (
    <>
      <Head>
        <title>{i18n.formatMessage({ id: 'page.home.title' })}</title>
      </Head>

      <Layout>
        <Portfolio />
      </Layout>
    </>
  );
};

export default PortfolioPage;
