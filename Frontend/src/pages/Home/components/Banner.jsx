import React from 'react';

const Banner = ({ onBuyClick }) => {
  return (
    <div className="mb-6 mx-4">
      <div 
        className="relative rounded-2xl overflow-hidden shadow-xl"
        style={{
          background: '#00a6a6',
          minHeight: '200px'
        }}
      >
        {/* Background Pattern - Dots */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Content Container */}
        <div className="relative flex items-center p-6">
          {/* Left Section - Text (2/3 width) */}
          <div className="flex-[2] pr-6">
            <p 
              className="text-white text-2xl font-semibold leading-relaxed"
              style={{
                lineHeight: '1.5',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              Appzeto provides hassle
              <br />
              free services at the
              <br />
              door step
            </p>
          </div>

          {/* Right Section - White Card with Logo (1/3 width) */}
          <div 
            className="flex-[1] flex-shrink-0 bg-white rounded-2xl p-5 shadow-xl relative overflow-hidden"
            style={{
              minWidth: '160px',
              maxWidth: '180px',
              marginLeft: 'auto',
              transform: 'translateX(10px)'
            }}
          >
            {/* Subtle dot pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03] rounded-2xl"
              style={{
                backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                backgroundSize: '12px 12px'
              }}
            />
            
            {/* Logo Section */}
            <div className="relative flex flex-col items-center justify-center h-full min-h-[140px]">
              {/* Appzeto Logo */}
              <div className="mb-4">
                <img 
                  src="/Appzeto-logo.png" 
                  alt="Appzeto" 
                  className="h-12 w-auto object-contain"
                />
              </div>
              
              {/* Tagline */}
              <p 
                className="text-[10px] font-medium text-center text-black"
                style={{
                  letterSpacing: '0.3px',
                  fontFamily: 'monospace'
                }}
              >
                &lt;REFLECT/TECHNOLOGY&gt;
              </p>

              {/* Sparkle Icon at bottom right */}
              <div className="absolute bottom-3 right-3 opacity-40">
                <svg 
                  className="w-5 h-5 text-gray-500" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;

