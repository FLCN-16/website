import type { NextPage } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

// Containers
import Layout from '../container/Layout';
import About from '../container/About';

const AboutPage: NextPage = () => {
  const i18n = useIntl();

  return (
    <>
      <Head>
        <title>{i18n.formatMessage({ id: 'legal.brand' })}</title>
      </Head>

      <Layout>
        <About />
      </Layout>
    </>
  );
};

export default AboutPage;
