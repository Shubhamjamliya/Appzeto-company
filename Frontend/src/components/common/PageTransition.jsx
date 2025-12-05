import React from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="page-transition-enter-active animate-slide-right"
      style={{
        width: '100%',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;

