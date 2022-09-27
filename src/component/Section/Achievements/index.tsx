import React from 'react';
import { Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Components
import Section from '..';

// Data
import achievements from '../../../data/achievements.json';

// Styles
import 'swiper/css';
import 'swiper/css/pagination';
import { AchievementSliderSlide } from './style'


const sliderConfig = {
  modules: [Pagination, Autoplay],
  navigation: true,
  slidesPerView: 1,
  scrollbar: { draggable: true },
  loop: true,
  pagination: { clickable: true, dynamicBullets: true, dynamicMainBullets: 5 },
  centeredSlides: false,
  autoplay: { delay: 5000 },
};

const AchievementsSection: React.FC = () => {
  return (
    <Section title="Achievements">
      <div className="w-full my-6">
        <Swiper {...sliderConfig}>
          {achievements.map((achievement, index) => (
            <SwiperSlide key={`slide-${index}`}>
              <AchievementSliderSlide
                layoutId={`slide-${index}`}
                initial={false}
                whileHover="hover"
                whileFocus="hover"
                animate="rest"
              >
                <h5 className='iline-block font-bold text-2xl mb-2'>{achievement.title}</h5>
                <p className='text-gray-600'>{achievement.desc}</p>
              </AchievementSliderSlide>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Section>
  );
}

export default AchievementsSection;