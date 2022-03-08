import type { NextPage } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

const Home: NextPage = () => {
  const i18n = useIntl();

  return (
    <>
      <Head>
        <title>{i18n.formatMessage({ id: 'legal.brand' })}</title>
      </Head>

      <div className="bg-gray-600 h-5 w-5"></div>
    </>
  );
};

export default Home;
