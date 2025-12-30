import React from 'react';
import homepageBanner from '../../../../../assets/images/pages/Home/Banner/homepage-banner.png';

const Banner = ({ imageUrl, onClick }) => {
  return (
    <div className="mb-8 px-4 cursor-pointer group" onClick={onClick}>
      <div
        className="relative overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.01]"
        style={{
          borderRadius: '20px',
          boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.1), 0 5px 15px -3px rgba(0, 0, 0, 0.05)'
        }}
      >
        <img
          src={imageUrl || homepageBanner}
          alt="Banner"
          className="w-full h-full object-fill min-h-[150px]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default Banner;

