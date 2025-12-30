import React from 'react';
import { themeColors } from '../../../../../theme';

const VendorSearchModal = ({ isOpen, onClose, currentStep, acceptedVendor }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {(currentStep === 'searching' || currentStep === 'waiting') && (
          <div className="relative w-full h-[550px] bg-white overflow-hidden rounded-3xl flex flex-col border border-gray-100">

            {/* Map Background Pattern (Light) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(#347989 1px, transparent 1px), linear-gradient(90deg, #347989 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }}
              ></div>
              {/* Fake Roads/Map Lines */}
              <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 -rotate-12 transform origin-center"></div>
              <div className="absolute top-0 left-1/2 h-full w-2 bg-gray-200 rotate-12 transform origin-center"></div>
              <div className="absolute top-1/4 left-0 w-full h-1 bg-gray-100 rotate-45"></div>
            </div>

            {/* Radar Scanners */}
            <div className="absolute inset-0 flex items-center justify-center">

              {/* Pulse Rings - Using Brand Teal */}
              <div className="absolute w-[400px] h-[400px] rounded-full border opacity-20 animate-ping" style={{ borderColor: themeColors.brand.teal, animationDuration: '3s' }}></div>
              <div className="absolute w-[300px] h-[300px] rounded-full border opacity-30 animate-ping" style={{ borderColor: themeColors.brand.teal, animationDuration: '3s', animationDelay: '0.5s' }}></div>

              {/* Rotating Scanner */}
              <div className="relative w-[350px] h-[350px] rounded-full border flex items-center justify-center" style={{ borderColor: `${themeColors.brand.teal}40` }}>
                {/* Scanner Gradient */}
                <div className="absolute inset-0 rounded-full animate-spin-slow"
                  style={{
                    background: `conic-gradient(from 0deg, transparent 0deg, transparent 270deg, ${themeColors.brand.teal}66 360deg)`,
                    animationDuration: '4s'
                  }}
                ></div>

                {/* Inner Circles */}
                <div className="absolute w-[250px] h-[250px] rounded-full border" style={{ borderColor: `${themeColors.brand.teal}20` }}></div>
                <div className="absolute w-[150px] h-[150px] rounded-full border" style={{ borderColor: `${themeColors.brand.teal}30` }}></div>

                {/* User Location Pulse - Center */}
                <div className="relative z-10 w-4 h-4 rounded-full shadow-lg animate-pulse" style={{ backgroundColor: themeColors.brand.teal, boxShadow: `0 0 20px ${themeColors.brand.teal}` }}>
                  <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: themeColors.brand.teal }}></div>
                </div>

                {/* Simulated Vendor Dots - Using Brand Yellow/Orange */}
                <div className="absolute top-10 right-20 w-3 h-3 rounded-full shadow-md animate-pulse" style={{ backgroundColor: themeColors.brand.yellow }}></div>
                <div className="absolute bottom-16 left-12 w-3 h-3 rounded-full shadow-md animate-pulse" style={{ backgroundColor: themeColors.brand.orange, animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-4 w-2 h-2 rounded-full shadow-sm animate-pulse" style={{ backgroundColor: themeColors.brand.yellow, animationDelay: '2s' }}></div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeColors.brand.teal }}></span>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: themeColors.brand.teal }}>Live Search</span>
              </div>
              <button
                onClick={onClose}
                className="bg-white hover:bg-gray-50 text-gray-400 p-2 rounded-full shadow-sm border border-gray-100 transition-colors"
                title="Minimize"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </button>
            </div>

            {/* Bottom Status Card */}
            <div className="mt-auto relative z-20 p-6">
              <div className="bg-white/90 backdrop-blur-xl border border-teal-50 p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md shrink-0 text-white" style={{ background: themeColors.brand.gradient }}>
                    <span className="text-xl animate-spin-slow" style={{ animationDuration: '3s' }}>↻</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {currentStep === 'searching' ? 'Scanning nearby...' : 'Waiting for confirmation'}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {currentStep === 'searching'
                        ? `We are looking for the top-rated professionals in your area.`
                        : 'Request sent! Waiting for a professional to accept your job.'}
                    </p>
                  </div>
                </div>

                {/* Minimize / Background Action hint */}
                <button
                  onClick={onClose}
                  className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600"
                >
                  <span>Minimize & Browse</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
              </div>
            </div>

          </div>
        )}

        {currentStep === 'accepted' && acceptedVendor && (
          <div className="text-center py-10 px-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce" style={{ backgroundColor: `${themeColors.brand.teal}1A` }}>
              <span className="text-5xl">🎉</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Vendor Found!</h3>

            <div className="rounded-xl p-5 mb-6 border-2" style={{ background: `linear-gradient(135deg, ${themeColors.brand.teal}0D 0%, ${themeColors.brand.teal}1A 100%)`, borderColor: `${themeColors.brand.teal}33` }}>
              <h4 className="font-bold text-xl mb-3" style={{ color: themeColors.button }}>{acceptedVendor.businessName}</h4>
              <div className="flex items-center justify-center gap-6 text-sm mb-4" style={{ color: `${themeColors.brand.teal}CC` }}>
                <span className="flex items-center gap-1">
                  ⭐ {acceptedVendor.rating || '4.8'}
                </span>
                <span className="flex items-center gap-1">
                  📍 {acceptedVendor.distance || 'nearby'}
                </span>
                <span className="flex items-center gap-1">
                  🕐 {acceptedVendor.estimatedTime || '15-20 min'}
                </span>
              </div>
              <div className="text-3xl font-bold" style={{ color: themeColors.button }}>
                ₹{acceptedVendor.price || '0'}
              </div>
            </div>

            <p className="text-gray-600 text-base mb-6">
              {acceptedVendor.businessName} has accepted your booking!
            </p>

            <button
              onClick={onClose}
              className="w-full text-white py-4 rounded-xl text-base font-semibold transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: themeColors.button }}
            >
              Continue to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorSearchModal;
