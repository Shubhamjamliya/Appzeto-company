import React from 'react';
import homepageBanner from '../../../assets/images/pages/Home/Banner/homepage-banner.png';

const Banner = ({ onBuyClick }) => {
  return (
    <div className="mb-6">
      <div 
        className="relative overflow-hidden shadow-xl"
        style={{
          borderRadius: '0',
          backgroundImage: `url(${homepageBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '200px'
        }}
      >
      </div>
    </div>
  );
};

export default Banner;

