import styled from 'styled-components';

interface IWrapperProps {
  isLoading: boolean;
}

export const Wrapper = styled.div<IWrapperProps>`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: rgba(255, 255, 255, 1);
  z-index: 1000;

  visibility: ${(props) => (props.isLoading ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.isLoading ? 1 : 0)};
  transition: all 0.5s ease-in-out;
`;

export default {
  Wrapper,
};
