import styled from 'styled-components';
import { motion } from 'framer-motion';


export const WorkingInSliderSlide = styled(motion.div).attrs({
  className: 'flex p-4',
})`
  position: relative;

  .icon-content-wrapper {
    display: flex;
    position: relative;
    transition: all 0.3s ease-in-out;

    .image-wrapper {
      flex: 0 0 6rem;
      transition: all 0.3s ease-in-out;
      .image {
        filter: grayscale(100%);
        transition: filter 0.5s ease-in-out;
      }
    }

    &:hover {
      .image-wrapper {
        .image {
          filter: grayscale(0%);
        }
      }
    }

    @media (max-width: 768px) {
      .image-wrapper {
        flex: 0 0 4rem !important;

        .image {
          filter: grayscale(0%) !important;
        }
      }

      .content-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        opacity: 1 !important;
        transform: translateX(0) !important;
        margin-left: 25px !important;
      }
    }
  }
`;