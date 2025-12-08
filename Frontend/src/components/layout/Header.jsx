import React, { useRef, useEffect } from 'react';
import { HiLocationMarker } from 'react-icons/hi';
import { gsap } from 'gsap';
import LocationSelector from '../common/LocationSelector';
import { animateLogo } from '../../utils/gsapAnimations';

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
      style={{
        background: '#FCD34D',
        borderBottom: '2px solid #9CA3AF'
      }}
    >
      {/* Gradient overlay for depth */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.3), transparent 70%)'
        }}
      />
      
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10">
      <div className="w-full">
        {/* Top Row: Logo (Left) and Location (Right) */}
        <div className="px-4 py-3 flex items-center justify-between bg-white/5 backdrop-blur-sm">
          {/* Left: Logo */}
          <div 
            className="cursor-pointer"
            onMouseEnter={() => {
              if (logoRef.current) {
                gsap.to(logoRef.current, {
                  scale: 1.15,
                  filter: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.7)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2))',
                  duration: 0.3,
                  ease: 'power2.out',
                });
              }
            }}
            onMouseLeave={() => {
              if (logoRef.current) {
                gsap.to(logoRef.current, {
                  scale: 1.03,
                  filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))',
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
              style={{ opacity: 0 }}
            />
          </div>

          {/* Right: Location */}
          <div className="flex flex-col items-end cursor-pointer" onClick={onLocationClick}>
            <div className="flex items-center gap-1 mb-0.5">
              <HiLocationMarker className="w-4 h-4" style={{ color: '#F59E0B' }} />
              <span className="text-sm text-gray-800 font-bold">New Palasia</span>
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

