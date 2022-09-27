import type { NextPage } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

// Containers
import Layout from '../../container/Layout';
import PrivacyPolicy from '../../container/page/PrivacyPolicy';

const PrivacyPolicyPage: NextPage = () => {
  const i18n = useIntl();

  return (
    <>
      <Head>
        <title>{i18n.formatMessage({ id: 'page.privacy.title' })}</title>
      </Head>

      <Layout>
        <PrivacyPolicy />
      </Layout>
    </>
  );
};

export default PrivacyPolicyPage;
