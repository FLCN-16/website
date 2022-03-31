import React from 'react';

// Components
import HeroHeader from '../../../component/HeroHeader';
import WorkingInSection from '../../../component/Section/WorkingIn';

const Home: React.FC = () => {
  return (
    <React.Fragment>
      {/* Hero Header */}
      <HeroHeader />

      {/* Languages Section */}
      <WorkingInSection />
    </React.Fragment>
  );
}

export default Home;