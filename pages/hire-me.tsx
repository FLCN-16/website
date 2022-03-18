import type { NextPage } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';
import Layout from '../container/Layout';

const HireMe: NextPage = () => {
  const i18n = useIntl();

  return (
    <>
      <Head>
        <title>
          {i18n.formatMessage({ id: 'legal.brand' })} |{' '}
          {i18n.formatMessage({ id: 'text.hire-me' })}
        </title>
      </Head>

      <Layout>Hire Page</Layout>
    </>
  );
};

export default HireMe;
