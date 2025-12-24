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
      className="w-full relative"
    >
      <div className="relative w-full group">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Search icon */}
        <div
          className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10"
        >
          <FiSearch className="w-5 h-5 text-gray-400 group-hover:text-[#00A6A6] transition-colors duration-300" />
        </div>

        {/* Floating input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-[15px] bg-white border border-gray-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] group-hover:border-[#CCFBF1] group-hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.08)] focus:shadow-[0_8px_30px_-6px_rgba(0,166,166,0.15)] focus:border-[#00A6A6] transition-all duration-300 text-gray-800 placeholder-transparent outline-none ring-0"
          onFocus={(e) => {
            e.target.parentElement.classList.add('scale-[1.01]');
          }}
          onBlur={(e) => {
            if (!searchQuery) {
              e.target.parentElement.classList.remove('scale-[1.01]');
            }
          }}
        />

        {/* Placeholder text with typing animation */}
        {!searchQuery && (
          <div className="absolute inset-y-0 left-12 right-4 flex items-center pointer-events-none">
            <span className="text-[15px] text-gray-400 tracking-wide font-light">
              Search for <span className="font-medium text-[#00A6A6]">{displayedText}</span>
            </span>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;

