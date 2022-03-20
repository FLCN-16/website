import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 90px;
  background-image: radial-gradient(
      circle at center center,
      rgba(33, 33, 33, 0),
      rgb(33, 33, 33)
    ),
    repeating-linear-gradient(
      135deg,
      rgb(33, 33, 33) 0px,
      rgb(33, 33, 33) 1px,
      transparent 1px,
      transparent 4px
    ),
    repeating-linear-gradient(
      45deg,
      rgb(56, 56, 56) 0px,
      rgb(56, 56, 56) 5px,
      transparent 5px,
      transparent 6px
    ),
    linear-gradient(90deg, rgb(33, 33, 33), rgb(33, 33, 33));

  h1 {
    text-transform: uppercase;
    color: #fff;
    letter-spacing: 5px;
    font-weight: 600;
  }
`;

export default {
  Wrapper,
};
