import React from 'react';

const BannerWithRefer = ({ onBuyClick, onReferClick }) => {
  return (
    <div className="mb-6">
      {/* Main Banner */}
      <div className="mb-4 mx-4">
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

      {/* Refer & Earn Section */}
      <div 
        className="mx-4 rounded-2xl overflow-hidden shadow-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 166, 166, 0.08) 0%, rgba(41, 173, 129, 0.08) 100%)',
          border: '2px solid rgba(0, 166, 166, 0.2)'
        }}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex-1">
            <h3 
              className="text-lg font-bold mb-1 text-black"
            >
              Refer and get free services
            </h3>
            <p className="text-sm font-medium text-black">
              Invite and get ₹100*
            </p>
          </div>
          
          {/* Gift Boxes Illustration */}
          <div className="flex items-center gap-1 ml-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center transform rotate-12 shadow-md"
              style={{ 
                backgroundColor: 'rgba(0, 166, 166, 0.12)',
                border: '2px solid rgba(0, 166, 166, 0.2)'
              }}
            >
              <span className="text-2xl">🎁</span>
            </div>
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center transform -rotate-6 -ml-2 shadow-md"
              style={{ 
                backgroundColor: 'rgba(41, 173, 129, 0.12)',
                border: '2px solid rgba(41, 173, 129, 0.2)'
              }}
            >
              <span className="text-xl">🎁</span>
            </div>
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center transform rotate-12 -ml-2 shadow-md"
              style={{ 
                backgroundColor: 'rgba(251, 251, 0, 0.2)',
                border: '2px solid rgba(251, 251, 0, 0.3)'
              }}
            >
              <span className="text-lg">🎁</span>
            </div>
          </div>
        </div>
        <button
          onClick={onReferClick}
          className="w-full text-white font-bold py-3.5 active:scale-98 transition-all rounded-b-2xl shadow-lg hover:shadow-xl"
          style={{ 
            backgroundColor: '#00a6a6',
            boxShadow: '0 4px 6px -1px rgba(0, 166, 166, 0.3), 0 2px 4px -1px rgba(0, 166, 166, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#008a8a';
            e.target.style.transform = 'scale(0.98)';
            e.target.style.boxShadow = '0 6px 12px -2px rgba(0, 166, 166, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#00a6a6';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 166, 166, 0.3), 0 2px 4px -1px rgba(0, 166, 166, 0.2)';
          }}
        >
          Refer Now
        </button>
      </div>
    </div>
  );
};

export default BannerWithRefer;

