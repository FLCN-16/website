import type { NextPage } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

// Containers
import Layout from '../../container/Layout';
import TermsAndConditions from '../../container/page/TermsAndConditions';

const TermsPage: NextPage = () => {
  const i18n = useIntl();

  return (
    <>
      <Head>
        <title>{i18n.formatMessage({ id: 'page.terms.title' })}</title>
      </Head>

      <Layout>
        <TermsAndConditions />
      </Layout>
    </>
  );
}

export default TermsPage;