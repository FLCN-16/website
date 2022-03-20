import type { NextPage } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

// Containers
import Layout from '../container/Layout';
import Contact from '../container/page/Contact';

const ContactPage: NextPage = () => {
  const i18n = useIntl();

  return (
    <>
      <Head>
        <title>{i18n.formatMessage({ id: 'page.contact.title' })}</title>
      </Head>

      <Layout>
        <Contact />
      </Layout>
    </>
  );
};

export default ContactPage;
