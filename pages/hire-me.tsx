import type { NextPage } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

// Containers
import Layout from '../container/Layout';
import HireMe from '../container/HireMe';

const HireMePage: NextPage = () => {
  const i18n = useIntl();

  return (
    <>
      <Head>
        <title>
          {i18n.formatMessage({ id: 'legal.brand' })} |{' '}
          {i18n.formatMessage({ id: 'text.hire-me' })}
        </title>
      </Head>

      <Layout>
        <HireMe />
      </Layout>
    </>
  );
};

export default HireMePage;
