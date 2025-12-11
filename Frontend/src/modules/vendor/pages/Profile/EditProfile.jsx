import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiUser, FiBriefcase, FiPhone, FiMail, FiMapPin, FiTag } from 'react-icons/fi';
import { vendorTheme as themeColors } from '../../../../theme';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';

const EditProfile = () => {
  const navigate = useNavigate();
  
  // Helper function to convert hex to rgba
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    address: '',
    serviceCategories: [],
  });

  // Available service categories
  const availableCategories = [
    'AC Service',
    'Plumbing',
    'Electrician',
    'Cleaning',
    'Carpentry',
    'Painting',
    'Appliance Repair',
    'Salon Services',
    'Massage',
    'Bathroom Cleaning',
    'Kitchen Cleaning',
    'Sofa Cleaning',
    'Carpet Cleaning',
  ];

  const [errors, setErrors] = useState({});

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
          setFormData({
            name: vendorProfile.name || '',
            businessName: vendorProfile.businessName || '',
            phone: vendorProfile.phone || '',
            email: vendorProfile.email || '',
            address: vendorProfile.address || '',
            serviceCategories: vendorProfile.serviceCategories || [],
          });
        } else {
          // Set default values if no profile exists
          setFormData({
            name: 'Vendor Name',
            businessName: 'Business Name',
            phone: '+91 9876543210',
            email: 'vendor@example.com',
            address: 'Indore, Madhya Pradesh',
            serviceCategories: [],
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => {
      const currentCategories = prev.serviceCategories || [];
      if (currentCategories.includes(category)) {
        return {
          ...prev,
          serviceCategories: currentCategories.filter(cat => cat !== category),
        };
      } else {
        return {
          ...prev,
          serviceCategories: [...currentCategories, category],
        };
      }
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,13}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    try {
      // Load existing profile to preserve stats
      const existingProfile = JSON.parse(localStorage.getItem('vendorProfile') || '{}');
      
      const updatedProfile = {
        ...existingProfile,
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('vendorProfile', JSON.stringify(updatedProfile));
      window.dispatchEvent(new Event('vendorProfileUpdated'));
      navigate('/vendor/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: themeColors.backgroundGradient }}>
      <Header title="Edit Profile" />

      <main className="px-4 py-6">
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.icon}25 0%, ${themeColors.icon}15 100%)`,
                }}
              >
                <FiUser className="w-4 h-4" style={{ color: themeColors.icon }} />
              </div>
              <span>Name <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your name"
              className={`w-full px-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{ focusRingColor: themeColors.button }}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.icon}25 0%, ${themeColors.icon}15 100%)`,
                }}
              >
                <FiBriefcase className="w-4 h-4" style={{ color: themeColors.icon }} />
              </div>
              <span>Business Name <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Enter business name"
              className={`w-full px-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 ${
                errors.businessName ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{ focusRingColor: themeColors.button }}
            />
            {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.icon}25 0%, ${themeColors.icon}15 100%)`,
                }}
              >
                <FiPhone className="w-4 h-4" style={{ color: themeColors.icon }} />
              </div>
              <span>Phone Number <span className="text-red-500">*</span></span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
              className={`w-full px-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 ${
                errors.phone ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{ focusRingColor: themeColors.button }}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.icon}25 0%, ${themeColors.icon}15 100%)`,
                }}
              >
                <FiMail className="w-4 h-4" style={{ color: themeColors.icon }} />
              </div>
              <span>Email <span className="text-red-500">*</span></span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              className={`w-full px-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{ focusRingColor: themeColors.button }}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.icon}25 0%, ${themeColors.icon}15 100%)`,
                }}
              >
                <FiMapPin className="w-4 h-4" style={{ color: themeColors.icon }} />
              </div>
              <span>Address <span className="text-red-500">*</span></span>
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your address"
              rows={3}
              className={`w-full px-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 resize-none ${
                errors.address ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{ focusRingColor: themeColors.button }}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Service Categories */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.icon}25 0%, ${themeColors.icon}15 100%)`,
                }}
              >
                <FiTag className="w-4 h-4" style={{ color: themeColors.icon }} />
              </div>
              <span>Service Categories</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => {
                const isSelected = formData.serviceCategories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryToggle(category)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95"
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${themeColors.icon} 0%, ${themeColors.icon}dd 100%)`
                        : `linear-gradient(135deg, ${themeColors.icon}20 0%, ${themeColors.icon}10 100%)`,
                      color: isSelected ? '#FFFFFF' : themeColors.icon,
                      border: `1.5px solid ${isSelected ? themeColors.icon : `${themeColors.icon}40`}`,
                      boxShadow: isSelected
                        ? `0 2px 8px ${hexToRgba(themeColors.icon, 0.3)}`
                        : `0 2px 6px ${hexToRgba(themeColors.icon, 0.15)}`,
                    }}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
            {formData.serviceCategories.length === 0 && (
              <p className="text-gray-500 text-xs mt-2">Select at least one service category</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => navigate('/vendor/profile')}
            className="flex-1 py-4 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 transition-all active:scale-95"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{
              background: themeColors.button,
              boxShadow: `0 4px 12px ${themeColors.button}40`,
            }}
          >
            <FiSave className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default EditProfile;

