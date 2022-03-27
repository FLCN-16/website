import React from 'react';
import { FormattedMessage } from 'react-intl';

import style from './style';

const HeroHeader = () => (
  <section id="hero-header" className="flex min-h-screen overflow-hidden">
    <div className="container px-5 md:px-0 relative mx-auto flex items-center">
      <div className="relative md:w-1/2 z-10">
        <h1 className="text-5xl uppercase font-bold">
          <FormattedMessage id="legal.brand" />
        </h1>

        <h2 className="text-xl text-gray-500 pl-3 border-l-4 border-gray-800">
          <FormattedMessage id="legal.tagline" />
        </h2>
      </div>

      <div className="absolute hidden md:block top-0 left-0 w-full h-full">
        <div className="absolute top-1/2 -translate-y-1/2 left-32">
          <svg
            viewBox="0 0 200 200"
            height="600px"
            className="relative top-0 -left-64 fill-gray-100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M53.6,-65.3C66.5,-53.1,72,-33.4,75.9,-13.1C79.8,7.1,82.1,27.9,74.7,45.5C67.4,63,50.4,77.3,31.7,81.8C13.1,86.3,-7.2,80.9,-26.2,73.4C-45.2,65.9,-62.8,56.2,-71.6,41.2C-80.3,26.3,-80.2,6.1,-74.5,-10.8C-68.8,-27.8,-57.5,-41.4,-44.2,-53.5C-30.8,-65.6,-15.4,-76.1,2.5,-79.1C20.4,-82,40.7,-77.4,53.6,-65.3Z"
              transform="translate(100 100)"
            />
          </svg>

          <svg
            viewBox="0 0 200 200"
            height="150px"
            className="absolute top-0 left-64 fill-gray-100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M62.7,-61.9C78.7,-46.7,87.4,-23.3,87.1,-0.3C86.8,22.8,77.6,45.6,61.6,62.2C45.6,78.8,22.8,89.2,1,88.2C-20.7,87.2,-41.4,74.7,-57,58C-72.6,41.4,-83,20.7,-83.6,-0.6C-84.2,-21.9,-74.9,-43.8,-59.3,-59C-43.8,-74.3,-21.9,-83,0.7,-83.8C23.3,-84.5,46.7,-77.2,62.7,-61.9Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        <div
          className="absolute brand-logo top-1/2 right-0 -translate-y-1/2 text-gray-700"
          style={{ height: '75%', width: '100vw' }}
        >
          <style.HeaderLogo />
        </div>
      </div>
    </div>
  </section>
);

export default React.memo(HeroHeader);
