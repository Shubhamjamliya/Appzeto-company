import React from 'react';
import { HiLocationMarker } from 'react-icons/hi';
import LocationSelector from '../common/LocationSelector';

const Header = ({ location, onLocationClick }) => {
  return (
    <header className="bg-white">
      <div className="w-full">
        {/* Top Row: Logo (Left) and Location (Right) */}
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Left: Logo */}
          <div>
            <img 
              src="/Appzeto-logo.png" 
              alt="Appzeto" 
              className="h-8 w-auto object-contain"
            />
          </div>

          {/* Right: Location */}
          <div className="flex flex-col items-end cursor-pointer" onClick={onLocationClick}>
            <div className="flex items-center gap-1 mb-0.5">
              <HiLocationMarker className="w-4 h-4 text-black" />
              <span className="text-sm text-black font-bold">New Palasia</span>
            </div>
            <LocationSelector 
              location={location} 
              onLocationClick={onLocationClick}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

