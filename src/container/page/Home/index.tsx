import React from 'react';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';

// Components
import HeroHeader from '../../../component/HeroHeader';
import Section from './Section';

import { WorkingInSliderSlide } from './style'

const slideImage = {
  rest: { height: '6rem', width: '6rem', flex: '0 0 6rem' },
  hover: { height: '3rem', width: '3rem', flex: '0 0 3rem' },
};

const programmingIcons = [
  {
    icon: 'typescript',
    title: 'Typescript',
    description: 'Typescript is a typed superset of JavaScript that compiles to plain JavaScript.',
  },
  {
    icon: 'javascript',
    title: 'Javascript',
    description: 'JavaScript is a high-level, interpreted programming language.',
  },
  {
    icon: 'react',
    title: 'React',
    description: 'React is a JavaScript library for building user interfaces.',
  },
  {
    icon: 'redux',
    title: 'Redux',
    description: 'Redux is a predictable state container for JavaScript apps.',
  },
  {
    icon: 'redux-saga',
    title: 'Redux Saga',
    description: 'Redux Saga is a library for easy implementation of asynchronous actions in Redux.',
  },
  {
    icon: 'next-js',
    title: 'Next.JS',
    description: 'Next.JS is a framework for server-rendered React applications.',
  },
  {
    icon: 'sass',
    title: 'Sass',
    description: 'Sass is a language extension for CSS.',
  },
  {
    icon: 'webpack',
    title: 'Webpack',
    description: 'Webpack is a module bundler.',
  },
  {
    icon: 'php',
    title: 'PHP',
    description: 'PHP is a server-side scripting language designed for web development.',
  },
];

const Home: React.FC = () => {
  const workingInSliderConfig = {
    modules: [Autoplay],
    autoplay: {
      delay: 3000,
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

  return (
    <React.Fragment>
      {/* Hero Header */}
      <HeroHeader />

      {/* Languages Section */}
      <Section title="Working In">
        <div className="w-full my-12">
          <Swiper {...workingInSliderConfig}>
            {programmingIcons.map((icon, index) => (
              <SwiperSlide key={`slide-${index}`}>
                <WorkingInSliderSlide
                  initial="rest"
                  whileHover="hover"
                  whileFocus="hover"
                  animate="rest"
                >
                  <motion.div className="icon-content-wrapper relative">
                    <motion.div
                      className="image-wrapper flex items-center"
                      variants={slideImage}
                      transition={{ type: 'linear' }}
                    >
                      <img
                        src={`/assets/programming-icons/${icon.icon}.svg`}
                        className="image w-full"
                        alt={icon.title}
                      />
                    </motion.div>

                    <motion.div
                      className="content-wrapper p-2 pt-1 justify-start"
                      variants={{
                        rest: { opacity: 0, x: '-10%' },
                        hover: { opacity: 1, x: '0%' },
                      }}
                      transition={{ type: 'spring', delay: 0.5 }}
                    >
                      <motion.h4 className="icon-title font-bold uppercase">
                        {icon.title}
                      </motion.h4>
                      <motion.p className="icon-description">
                        {icon.description}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                </WorkingInSliderSlide>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Section>
    </React.Fragment>
  );
}

export default Home;