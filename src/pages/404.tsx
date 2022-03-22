import type { NextPage } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

// Containers
import Layout from '../container/Layout';
import NotFound from '../container/page/NotFlound';

const NotFoundPage: NextPage = () => {
  const i18n = useIntl();

  return (
    <>
      <Head>
        <title>{i18n.formatMessage({ id: 'legal.brand' })}</title>
      </Head>

      <Layout>
        <NotFound />
      </Layout>
    </>
  );
};

export default NotFoundPage;
