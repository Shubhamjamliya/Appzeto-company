import React from 'react';
import { HiLocationMarker } from 'react-icons/hi';
import LocationSelector from '../common/LocationSelector';

const Header = ({ location, onLocationClick }) => {
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
          <div className="cursor-pointer">
            <img 
              src="/Appzeto-logo.png" 
              alt="Appzeto" 
              className="h-8 w-auto object-contain logo-animated"
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

