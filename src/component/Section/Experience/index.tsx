import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Components
import Section from '..';

// Data
import experiances from '../../../data/experiances.json';

gsap.registerPlugin(ScrollTrigger);


const ExperienceTimeline: React.FC = () => {
  React.useEffect(() => {
    let scrollLength = 750 * experiances.length;

    // GSAP scroll trigger
    let master_timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#experience-timeline',
        start: 'top 0%',
        end: `+=${scrollLength} 0%`,
        scrub: 1.25,
        pin: true,
        id: 'experience-timeline',
      },
    });
    
    for( let index in experiances ) {
      master_timeline.from(`experiance-${index}`, {
        y: '25px',
        opacity: 0,
      });
    }
  }, []);

  return (
    <Section title="Experience">
      <div id="experience-timeline" className="flex flex-col items-center relative">
        {experiances.map((experiance, index) => (
          <div
            key={`experiance-${index}`}
            id={`experiance-${index}`}
            className="absolute flex border rounded-lg p-8"
          >
            <span>{experiance.name}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default ExperienceTimeline;