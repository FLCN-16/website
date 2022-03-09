import styled from 'styled-components';

export const Wrapper = styled.header`
  display: flex;
  flex-direction: column;
  padding: 15px 25px;
`;

export const Navigation = styled.ul`
  display: flex;
  margin-left: auto;
`;

export const Brand = styled.div`
  display: inline-flex;
`;

export default {
  Wrapper,
  Navigation,
  Brand,
};
