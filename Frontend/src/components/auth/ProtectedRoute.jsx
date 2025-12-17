import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

/**
 * Protected Route Component
 * Checks if user is authenticated before allowing access
 */
const ProtectedRoute = ({ children, userType = 'user', redirectTo = null }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      let userData = null;

      // Check for user data based on userType
      switch (userType) {
        case 'user':
          userData = localStorage.getItem('userData');
          break;
        case 'vendor':
          userData = localStorage.getItem('vendorData');
          break;
        case 'worker':
          userData = localStorage.getItem('workerData');
          break;
        case 'admin':
          userData = localStorage.getItem('adminData');
          break;
        default:
          userData = localStorage.getItem('userData');
      }

      // If token exists, verify it's not expired (basic check)
      if (token && userData) {
        try {
          // Decode JWT token to check expiry (basic check without verification)
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            const currentTime = Date.now() / 1000;
            
            if (payload.exp && payload.exp > currentTime) {
              setIsAuthenticated(true);
            } else {
              // Token expired
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              if (userType === 'user') localStorage.removeItem('userData');
              if (userType === 'vendor') localStorage.removeItem('vendorData');
              if (userType === 'worker') localStorage.removeItem('workerData');
              if (userType === 'admin') localStorage.removeItem('adminData');
              setIsAuthenticated(false);
            }
          } else {
            // Invalid token format
            setIsAuthenticated(false);
          }
        } catch (error) {
          // Invalid token format
          console.error('Token validation error:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [userType, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#00a6a6' }}></div>
          <p className="text-gray-600 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Determine redirect path
    const defaultRedirects = {
      user: '/user/login',
      vendor: '/vendor/login',
      worker: '/worker/login',
      admin: '/admin/login'
    };
    
    const redirectPath = redirectTo || defaultRedirects[userType] || '/user/login';
    
    toast.error('Please login to continue');
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

