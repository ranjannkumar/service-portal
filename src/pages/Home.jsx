import React from 'react';
import Hero from '../components/Hero';
import BentoGrid from '../components/BentoGrid';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <div id="services">
        <BentoGrid />
      </div>
    </div>
  );
};

export default Home;
