import styled from 'styled-components';

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const NotFoundNumber = styled.h1`
  font-size: 5rem;
  font-weight: 600;
  text-transform: uppercase;
  line-height: 1;
  font-variant-numeric: slashed-zero;
  font-family: Arial, Helvetica, sans-serif;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

export const NotFoundText = styled.h2`
  font-size: 2rem;
  font-weight: 400;
  text-transform: uppercase;
  color: #aaa;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export default {
  Wrapper,
  NotFoundNumber,
  NotFoundText,
};
