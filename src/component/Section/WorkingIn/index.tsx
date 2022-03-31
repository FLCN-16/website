import React from "react";
import { Autoplay, Virtual } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';

// Components
import Section from '..';

// Import Swiper styles
import 'swiper/css';

// Data
import workingInLanguages from '../../../data/working-in.json';

import { WorkingInSliderSlide } from './style';

const slideImage = {
  rest: { height: '6rem', width: '6rem', flex: '0 0 6rem' },
  hover: { height: '3rem', width: '3rem', flex: '0 0 3rem' },
};

const workingInSliderConfig = {
  modules: [Autoplay, Virtual],
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    disableOnHover: false,
  },
  navigation: true,
  slidesPerView: 6,
  scrollbar: {
    draggable: true,
  },
  loop: true,
  pagination: { clickable: true },
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

const WorkingIn: React.FC = () => {
  return (
    <Section title="Working In">
      <div className="w-full my-12">
        <Swiper {...workingInSliderConfig} virtual>
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
                    className="image-wrapper flex items-center"
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
                      hover: { opacity: 1, x: '0%' },
                    }}
                    transition={{ type: 'spring', delay: 0.5 }}
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
      </div>
    </Section>
  );
}

export default WorkingIn;