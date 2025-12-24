import React, { useRef, useEffect } from 'react';
import { HiLocationMarker } from 'react-icons/hi';
import { gsap } from 'gsap';
import LocationSelector from '../common/LocationSelector';
import { animateLogo } from '../../../../utils/gsapAnimations';

const Header = ({ location, onLocationClick }) => {
  const logoRef = useRef(null);

  useEffect(() => {
    if (logoRef.current) {
      animateLogo(logoRef.current);
    }
  }, []);

  return (
    <header
      className="relative overflow-hidden"
    >
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10">
        <div className="w-full">
          {/* Top Row: Logo (Left) and Location (Right) */}
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Left: Logo */}
            <div
              className="cursor-pointer shrink-0"
              onMouseEnter={() => {
                if (logoRef.current) {
                  gsap.to(logoRef.current, {
                    scale: 1.15,
                    filter: 'drop-shadow(0 0 16px rgba(59, 130, 246, 0.5))',
                    duration: 0.3,
                    ease: 'power2.out',
                  });
                }
              }}
              onMouseLeave={() => {
                if (logoRef.current) {
                  gsap.to(logoRef.current, {
                    scale: 1,
                    filter: '',
                    duration: 0.3,
                    ease: 'power2.out',
                  });
                }
              }}
            >
              <img
                ref={logoRef}
                src="/Appzeto-logo.png"
                alt="Appzeto"
                className="h-8 w-auto object-contain"
              />
            </div>

            <div className="flex flex-col items-end cursor-pointer" onClick={onLocationClick}>
              <div className="flex items-center gap-1 mb-0.5">
                <HiLocationMarker className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-900 font-bold truncate max-w-[160px]">
                  {location && location !== '...' ? location.split('-')[0].trim() : 'Select Location'}
                </span>
              </div>
              <LocationSelector
                location={location}
                onLocationClick={onLocationClick}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

