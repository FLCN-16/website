import type { NextPage } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

const About: NextPage = () => {
  const i18n = useIntl();

  return (
    <>
      <Head>
        <title>{i18n.formatMessage({ id: 'legal.brand' })}</title>
      </Head>
    </>
  );
};

export default About;
