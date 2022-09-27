import { useIntl } from 'react-intl';

// Components
import PageTitle from '../../../component/PageTitle';

import style from './style';

const PrivacyPolicy = () => {
  const i18n = useIntl();

  return (
    <style.Wrapper>
      <PageTitle title={i18n.formatMessage({ id: 'text.privacy-policy' })} />
    </style.Wrapper>
  );
};

export default PrivacyPolicy;
