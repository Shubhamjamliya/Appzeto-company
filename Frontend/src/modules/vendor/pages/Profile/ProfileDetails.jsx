import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiEdit2, FiMapPin, FiPhone, FiMail, FiBriefcase, FiTag } from 'react-icons/fi';
import { vendorTheme as themeColors } from '../../../../theme';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';

const ProfileDetails = () => {
  const navigate = useNavigate();
  
  // Helper function to convert hex to rgba
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  const [profile, setProfile] = useState({
    name: 'Vendor Name',
    businessName: 'Business Name',
    phone: '+91 9876543210',
    email: 'vendor@example.com',
    address: 'Indore, Madhya Pradesh',
    serviceCategories: ['AC Service', 'Plumbing', 'Electrician', 'Cleaning'],
  });

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    const bgStyle = themeColors.backgroundGradient;

    if (html) html.style.background = bgStyle;
    if (body) body.style.background = bgStyle;
    if (root) root.style.background = bgStyle;

    return () => {
      if (html) html.style.background = '';
      if (body) body.style.background = '';
      if (root) root.style.background = '';
    };
  }, []);

  useEffect(() => {
    const loadProfile = () => {
      try {
        const vendorProfile = JSON.parse(localStorage.getItem('vendorProfile') || '{}');
        if (Object.keys(vendorProfile).length > 0) {
          setProfile(prev => ({ 
            ...prev, 
            ...vendorProfile,
            serviceCategories: vendorProfile.serviceCategories || ['AC Service', 'Plumbing', 'Electrician', 'Cleaning']
          }));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
    window.addEventListener('vendorProfileUpdated', loadProfile);

    return () => {
      window.removeEventListener('vendorProfileUpdated', loadProfile);
    };
  }, []);

  return (
    <div className="min-h-screen pb-20" style={{ background: themeColors.backgroundGradient }}>
      <Header title="Profile Details" />

      <main className="px-4 py-6">
        {/* Profile Info Card */}
        <div
          className="rounded-2xl p-5 mb-6 shadow-lg relative overflow-hidden border-2"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
            borderColor: hexToRgba(themeColors.icon, 0.3),
            boxShadow: `0 8px 24px ${hexToRgba(themeColors.icon, 0.15)}, 0 4px 12px ${hexToRgba(themeColors.icon, 0.1)}`,
          }}
        >
          {/* Left accent */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
            style={{
              background: `linear-gradient(180deg, ${themeColors.icon} 0%, ${themeColors.icon}dd 100%)`,
            }}
          />
          
          <div className="relative z-10 pl-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Profile Information</h3>
              <button
                onClick={() => navigate('/vendor/profile/edit')}
                className="p-2.5 rounded-xl hover:scale-110 transition-all flex items-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.button} 0%, ${themeColors.icon} 100%)`,
                  color: '#FFFFFF',
                  boxShadow: `0 4px 12px ${hexToRgba(themeColors.button, 0.3)}`,
                }}
              >
                <FiEdit2 className="w-5 h-5" />
                <span className="text-sm font-semibold">Edit</span>
              </button>
            </div>

            <div className="space-y-3">
              <div
                className="flex items-start gap-4 p-4 rounded-xl border-2 transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                  borderColor: hexToRgba(themeColors.icon, 0.2),
                  boxShadow: `0 4px 12px ${hexToRgba(themeColors.icon, 0.1)}`,
                }}
              >
                <div
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.icon}25 0%, ${themeColors.icon}15 100%)`,
                    boxShadow: `0 4px 12px ${hexToRgba(themeColors.icon, 0.2)}`,
                  }}
                >
                  <FiUser className="w-6 h-6" style={{ color: themeColors.icon }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Name</p>
                  <p className="font-bold text-gray-900 text-lg">{profile.name}</p>
                </div>
              </div>

              <div
                className="flex items-start gap-4 p-4 rounded-xl border-2 transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                  borderColor: hexToRgba(themeColors.icon, 0.2),
                  boxShadow: `0 4px 12px ${hexToRgba(themeColors.icon, 0.1)}`,
                }}
              >
                <div
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.icon}25 0%, ${themeColors.icon}15 100%)`,
                    boxShadow: `0 4px 12px ${hexToRgba(themeColors.icon, 0.2)}`,
                  }}
                >
                  <FiBriefcase className="w-6 h-6" style={{ color: themeColors.icon }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Business Name</p>
                  <p className="font-bold text-gray-900 text-lg">{profile.businessName}</p>
                </div>
              </div>

              <div
                className="flex items-start gap-4 p-4 rounded-xl border-2 transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                  borderColor: hexToRgba(themeColors.icon, 0.2),
                  boxShadow: `0 4px 12px ${hexToRgba(themeColors.icon, 0.1)}`,
                }}
              >
                <div
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.icon}25 0%, ${themeColors.icon}15 100%)`,
                    boxShadow: `0 4px 12px ${hexToRgba(themeColors.icon, 0.2)}`,
                  }}
                >
                  <FiPhone className="w-6 h-6" style={{ color: themeColors.icon }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Phone</p>
                  <p className="font-bold text-gray-900 text-lg">{profile.phone}</p>
                </div>
              </div>

              <div
                className="flex items-start gap-4 p-4 rounded-xl border-2 transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                  borderColor: hexToRgba(themeColors.icon, 0.2),
                  boxShadow: `0 4px 12px ${hexToRgba(themeColors.icon, 0.1)}`,
                }}
              >
                <div
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.icon}25 0%, ${themeColors.icon}15 100%)`,
                    boxShadow: `0 4px 12px ${hexToRgba(themeColors.icon, 0.2)}`,
                  }}
                >
                  <FiMail className="w-6 h-6" style={{ color: themeColors.icon }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Email</p>
                  <p className="font-bold text-gray-900 text-lg">{profile.email}</p>
                </div>
              </div>

              <div
                className="flex items-start gap-4 p-4 rounded-xl border-2 transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                  borderColor: hexToRgba(themeColors.icon, 0.2),
                  boxShadow: `0 4px 12px ${hexToRgba(themeColors.icon, 0.1)}`,
                }}
              >
                <div
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.icon}25 0%, ${themeColors.icon}15 100%)`,
                    boxShadow: `0 4px 12px ${hexToRgba(themeColors.icon, 0.2)}`,
                  }}
                >
                  <FiMapPin className="w-6 h-6" style={{ color: themeColors.icon }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wider">Address</p>
                  <p className="font-bold text-gray-900 text-lg">{profile.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Categories */}
        {profile.serviceCategories && profile.serviceCategories.length > 0 && (
          <div
            className="rounded-2xl p-5 mb-6 shadow-lg relative overflow-hidden border-2"
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
              borderColor: hexToRgba(themeColors.icon, 0.3),
              boxShadow: `0 8px 24px ${hexToRgba(themeColors.icon, 0.15)}, 0 4px 12px ${hexToRgba(themeColors.icon, 0.1)}`,
            }}
          >
            {/* Left accent */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
              style={{
                background: `linear-gradient(180deg, ${themeColors.icon} 0%, ${themeColors.icon}dd 100%)`,
              }}
            />
            
            <div className="relative z-10 pl-3">
              <div className="flex items-center gap-2 mb-4">
                <FiTag className="w-5 h-5" style={{ color: themeColors.icon }} />
                <h3 className="font-bold text-gray-900 text-lg">Service Categories</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {profile.serviceCategories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                    style={{
                      background: `linear-gradient(135deg, ${themeColors.icon}20 0%, ${themeColors.icon}10 100%)`,
                      color: themeColors.icon,
                      border: `1.5px solid ${themeColors.icon}40`,
                      boxShadow: `0 2px 6px ${hexToRgba(themeColors.icon, 0.15)}`,
                    }}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfileDetails;

