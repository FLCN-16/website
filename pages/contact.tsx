import type { NextPage } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';
import Layout from '../container/Layout';

const Contact: NextPage = () => {
  const i18n = useIntl();

  return (
    <>
      <Head>
        <title>{i18n.formatMessage({ id: 'legal.brand' })}</title>
      </Head>

      <Layout>Contact Page</Layout>
    </>
  );
};

export default Contact;
