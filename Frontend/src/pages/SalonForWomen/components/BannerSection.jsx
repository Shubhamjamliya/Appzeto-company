import React, { useState, useEffect, useRef } from 'react';
import { FiArrowLeft, FiSearch, FiShare2 } from 'react-icons/fi';
import parlorBanner from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/parlor-banner.jpg';
import spaBanner from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/spa-banner.jpg';
import salon1Image from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-1.jpg';

const BannerSection = ({ onBack, onSearch, onShare, showStickyNav }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const banners = [
    {
      id: 1,
      image: parlorBanner,
      text: 'Parlor Services',
    },
    {
      id: 2,
      image: spaBanner,
      text: 'Spa Services',
    },
    {
      id: 3,
      image: salon1Image,
      text: 'Salon Services',
    },
  ];

  useEffect(() => {
    // Auto-play carousel
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000); // Change slide every 3 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    // Reset interval when manually changing slide
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);
  };

  return (
    <div className="relative w-full h-64 overflow-hidden">
      {/* Overlay buttons on banner - Fixed until sticky nav appears */}
      <div 
        className={`fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between transition-all duration-300 ${
          showStickyNav ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
        >
          <FiArrowLeft className="w-6 h-6 text-gray-800" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onSearch}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
          >
            <FiSearch className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={onShare}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
          >
            <FiShare2 className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="min-w-full h-full relative flex-shrink-0"
          >
            <img
              src={banner.image}
              alt={banner.text}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <p className="text-lg font-semibold mb-2">{banner.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full">
        <div
          className="h-full bg-white rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / banners.length) * 100}%` }}
        ></div>
      </div>

      {/* Indicator dots */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-1.5">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSection;

