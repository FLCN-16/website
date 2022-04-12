import React from "react";
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';

// Components
import Section from '..';

// Data
import workingInLanguages from '../../../data/working-in.json';

// Styles
import 'swiper/css';
import 'swiper/css/pagination';
import { WorkingInSliderSlide } from './style';

const slideImage = {
  rest: { height: '6rem', width: '6rem', flex: '0 0 6rem', left: '50%', x: '-50%' },
  hover: { height: '4rem', width: '4rem', flex: '0 0 4rem', left: '0%', x: '0%' },
};

const workingInSliderConfig = {
  modules: [Pagination],
  navigation: true,
  slidesPerView: 6,
  scrollbar: {
    draggable: true,
  },
  loop: true,
  pagination: { clickable: true, dynamicBullets: true, dynamicMainBullets: 5 },
  centeredSlides: false,
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
      centeredSlides: true,
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    // when window width is >= 1024px
    1024: {
      slidesPerView: 4,
      spaceBetween: 10,
    },
    // when window width is >= 1280px
    1280: {
      slidesPerView: 6,
      spaceBetween: 0,
    },
  },
};

const Slider: React.FC = () => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Swiper {...workingInSliderConfig}>
      {workingInLanguages.map((language, index) => (
        <SwiperSlide key={`slide-${index}`}>
          <WorkingInSliderSlide
            layoutId={`slide-${index}`}
            initial={false}
            whileHover="hover"
            whileFocus="hover"
            animate="rest"
          >
            <div className="icon-content-wrapper relative">
              <motion.div
                className="image-wrapper relative flex items-center"
                variants={slideImage}
                transition={{ type: 'linear' }}
              >
                <img
                  src={`/assets/programming-icons/${language.icon}.svg`}
                  className="image w-full"
                  alt={language.title}
                />
              </motion.div>

              <motion.div
                className="content-wrapper p-2 pt-1 justify-start"
                variants={{
                  rest: { opacity: 0, x: '10%' },
                  hover: { opacity: 1, x: '0%', transition: { delay: 0.55 } },
                }}
                transition={{ type: 'spring' }}
              >
                <motion.h4 className="icon-title font-bold uppercase">
                  {language.title}
                </motion.h4>
                <motion.p className="icon-description">
                  {language.description}
                </motion.p>
              </motion.div>
            </div>
          </WorkingInSliderSlide>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

const WorkingIn: React.FC = () => {
  return (
    <Section title="Working In">
      <div className="w-full my-12">
        <Slider />
      </div>
    </Section>
  );
}

export default WorkingIn;