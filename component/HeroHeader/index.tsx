import React from 'react';
import { FormattedMessage } from 'react-intl';

const HeroHeader = () => (
  <section id="hero-header" className="flex min-h-screen">
    <div className="container relative mx-auto flex items-center">
      <div className="relative w-full">
        <h1 className="text-5xl uppercase font-bold">
          <FormattedMessage id="legal.brand" />
        </h1>

        <h2 className="text-2xl">
          <FormattedMessage id="legal.tagline" />
        </h2>
      </div>
    </div>
  </section>
);

export default React.memo(HeroHeader);
