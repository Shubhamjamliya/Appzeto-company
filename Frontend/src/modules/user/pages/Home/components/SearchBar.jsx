import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);

  // Only 3 service names
  const serviceNames = ['facial', 'kitchen cleaning', 'AC service'];

  // Defer animation start until after page load to avoid blocking initial render
  useEffect(() => {
    // Start animation after page is loaded (defer to avoid blocking initial render)
    const startAnimation = () => {
      setAnimationStarted(true);
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if (window.requestIdleCallback) {
      window.requestIdleCallback(startAnimation, { timeout: 500 });
    } else {
      setTimeout(startAnimation, 300);
    }
  }, []);

  useEffect(() => {
    // Don't start animation until page is loaded
    if (!animationStarted) return;

    const currentService = serviceNames[currentServiceIndex];
    let timeoutId;

    if (isTyping) {
      // Typing animation - forward direction (slower to reduce CPU usage)
      let currentCharIndex = 0;
      const typeNextChar = () => {
        if (currentCharIndex <= currentService.length) {
          setDisplayedText(currentService.slice(0, currentCharIndex));
          currentCharIndex++;
          // Use requestAnimationFrame for better performance
          timeoutId = requestAnimationFrame(() => {
            setTimeout(() => typeNextChar(), 150); // Slower typing speed
          });
        } else {
          // Wait after typing complete
          setTimeout(() => {
            setIsTyping(false);
          }, 2000); // Wait 2 seconds before erasing
        }
      };
      typeNextChar();
    } else {
      // Erasing animation - backward direction (slower to reduce CPU usage)
      let currentCharIndex = currentService.length;
      const eraseNextChar = () => {
        if (currentCharIndex >= 0) {
          setDisplayedText(currentService.slice(0, currentCharIndex));
          currentCharIndex--;
          // Use requestAnimationFrame for better performance
          timeoutId = requestAnimationFrame(() => {
            setTimeout(() => eraseNextChar(), 150); // Slower erasing speed
          });
        } else {
          // Move to next service
          setCurrentServiceIndex((prev) => (prev + 1) % serviceNames.length);
          setIsTyping(true);
        }
      };
      eraseNextChar();
    }

    return () => {
      if (timeoutId) {
        if (typeof timeoutId === 'number') {
          clearTimeout(timeoutId);
        } else {
          cancelAnimationFrame(timeoutId);
        }
      }
    };
  }, [currentServiceIndex, isTyping, animationStarted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="sticky top-0 z-40 py-2.5 px-4 mb-0 flex justify-center relative"
    >
      <div className="relative w-full max-w-md z-10">
        <div className="relative w-full">
          {/* Search icon container with gradient */}
          <div 
            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"
            style={{
              background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)',
              borderRadius: '9999px 0 0 9999px',
              paddingLeft: '12px',
              paddingRight: '6px'
            }}
          >
            <FiSearch className="w-4 h-4" style={{ color: '#F59E0B', filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.4))' }} />
          </div>
          
          {/* Enhanced input with glassmorphism */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 rounded-full text-sm border-2 focus:outline-none transition-all"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.7)',
              color: searchQuery ? '#111827' : 'transparent',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#F59E0B';
              e.target.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.25), 0 12px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.9)';
              e.target.style.background = 'rgba(255, 255, 255, 1)';
              e.target.style.transform = 'scale(1.02)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.7)';
              e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
              e.target.style.background = 'rgba(255, 255, 255, 0.95)';
              e.target.style.transform = 'scale(1)';
            }}
          />
          
          {/* Placeholder text with enhanced styling */}
          {!searchQuery && (
            <div className="absolute inset-y-0 left-12 right-4 flex items-center pointer-events-none z-10">
              <span 
                className="text-sm font-medium"
                style={{ 
                  color: '#666666'
                }}
              >
                Search for <span 
                  className="font-semibold"
                  style={{ 
                    color: '#F59E0B'
                  }}
                >{displayedText}</span>
              </span>
            </div>
          )}
          
          {/* Glow effect on focus */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none opacity-0 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
              filter: 'blur(10px)',
              zIndex: -1
            }}
          />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;

