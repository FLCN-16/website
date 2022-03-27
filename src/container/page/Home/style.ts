import styled, {keyframes} from 'styled-components';


const contentInAnim = keyframes`
  0% {
    opacity: 0;
    width: 0;
    height: 0;
    visibility: hidden;
  }
  45% {
    opacity: 0;
    width: 0;
    height: 0;
    visibility: hidden;
  }
  50% {
    width: auto;
    height: auto;
  }
  100% {
    opacity: 1;
    width: auto;
    height: auto;
    visibility: visible;
  }
`;

export const WorkingInSliderSlide = styled.div.attrs({
  className: 'flex flex-col p-4',
})`
  position: relative;

  .icon-content-wrapper {
    display: flex;
    position: relative;
    top: 0;
    left: 50%;
    transition: all 0.3s ease-in-out;

    .image-wrapper {
      transition: all 0.3s ease-in-out;
      .image {
        filter: grayscale(100%);
        transition: filter 0.3s ease-in-out;
      }
    }

    .content-wrapper {
      opacity: 0;
      width: 0;
      height: 0;
      visibility: hidden;
      transition: all 0.3s ease-in-out;
    }

    &:hover {
      left: 0;

      .image-wrapper {
        height: 4rem;
        width: 4rem;
        min-width: 4rem;

        .image {
          filter: grayscale(0%);
        }
      }

      .content-wrapper {
        display: flex;
        flex-direction: column;
        animation: ${contentInAnim} 0.6s ease-in-out forwards;
      }
    }
  }
`;