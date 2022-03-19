import styled from 'styled-components';

import LogoImg from '../../public/assets/logo.svg';

const HeaderLogo = styled(LogoImg)`
  max-height: 100%;
  margin-left: auto;
  filter: drop-shadow(rgba(0, 0, 0, 0.15) 0px 0px 1px);
  transition: filter 0.2s ease-in-out;

  &:hover {
    filter: drop-shadow(rgba(0, 0, 0, 0.15) 5px 5px 1px);
  }
`;

export default {
  HeaderLogo,
};
