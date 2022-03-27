import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

// Components
import HeroHeader from '../../../component/HeroHeader';
import Section from './Section';

import { WorkingInSliderSlide } from './style'

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
    navigation: true,
    spaceBetween: 50,
    slidesPerView: 6,
    scrollbar: {
      draggable: true,
    },
    pagination: { clickable: true },
    centeredSlides: false,
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
                <WorkingInSliderSlide>
                  <div className="icon-content-wrapper relative">
                    <div className="image-wrapper flex items-center w-24 h-24">
                      <img
                        src={`/assets/programming-icons/${icon.icon}.svg`}
                        className="image w-full"
                        alt={icon.title}
                      />
                    </div>

                    <div className="content-wrapper p-2 pt-1 justify-start">
                      <h4 className="icon-title font-bold uppercase">{icon.title}</h4>
                      <p className="icon-description">{icon.description}</p>
                    </div>
                  </div>
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