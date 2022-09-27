import React from 'react';

// Components
import HeroHeader from '../../../component/HeroHeader';
import WorkedOnSection from '../../../component/Section/WorkedOn';
import WorkingInSection from '../../../component/Section/WorkingIn';
import AchievementsSection from '../../../component/Section/Achievements';

const Home: React.FC = () => {
  return (
    <React.Fragment>
      {/* Hero Header */}
      <HeroHeader />

      {/* Worked On Section */}
      {/* <WorkedOnSection /> */}

      {/* Languages Section */}
      <WorkingInSection />

      {/* Achievements Section */}
      <AchievementsSection />
    </React.Fragment>
  );
}

export default Home;