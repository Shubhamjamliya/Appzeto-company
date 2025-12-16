import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiUser, FiPhone, FiMail, FiMapPin, FiTag } from 'react-icons/fi';
import { workerTheme as themeColors } from '../../../../theme';
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
    phone: '',
    email: '',
    address: '',
    serviceCategory: '',
    skills: [],
  });

  // Load service categories from admin config (dynamic)
  // Initialize with fallback categories so they're always available
  const [availableCategories, setAvailableCategories] = useState(['Electrician', 'Plumber', 'Salon', 'Carpenter', 'Cleaning']);
  const [skillsByCategory, setSkillsByCategory] = useState({
    'Electrician': ['Fan Repair', 'AC', 'Lightings', 'Wiring', 'Switch Repair'],
    'Plumber': ['Tap Repair', 'Pipe Installation', 'Geyser Repair', 'Bathroom Fitting'],
    'Salon': ['Haircut', 'Hair Color', 'Hair Spa', 'Facial'],
    'Carpenter': ['Furniture Repair', 'Door Installation', 'Cabinet Making'],
    'Cleaning': ['House Cleaning', 'Bathroom Cleaning', 'Kitchen Cleaning'],
  });

  useEffect(() => {
    const loadServiceCategories = () => {
      try {
        // Try loading from serviceCategories (old format)
        let categories = JSON.parse(localStorage.getItem('serviceCategories') || '[]');
        const serviceConfig = JSON.parse(localStorage.getItem('adminServiceConfig') || '{}');

        // If no categories in old format, try loading from new adminUserAppCatalog
        if (!categories || categories.length === 0) {
          try {
            const userAppCatalog = JSON.parse(localStorage.getItem('adminUserAppCatalog') || '{}');
            if (userAppCatalog.categories && Array.isArray(userAppCatalog.categories) && userAppCatalog.categories.length > 0) {
              // Convert new format to old format for compatibility
              categories = userAppCatalog.categories.map(cat => ({
                name: cat.title || cat.name || '',
                skills: [] // Skills are managed differently in new format
              }));
            }
          } catch (e) {
            console.log('Could not load from adminUserAppCatalog:', e);
          }
        }

        console.log('Loaded categories:', categories);
        console.log('Service config:', serviceConfig);

        // Always show fallback categories if nothing is found
        if (!categories || categories.length === 0) {
          console.warn('No categories found, using fallback');
          const fallbackCategories = ['Electrician', 'Plumber', 'Salon', 'Carpenter', 'Cleaning'];
          setAvailableCategories(fallbackCategories);
          setSkillsByCategory({
            'Electrician': ['Fan Repair', 'AC', 'Lightings', 'Wiring', 'Switch Repair'],
            'Plumber': ['Tap Repair', 'Pipe Installation', 'Geyser Repair', 'Bathroom Fitting'],
            'Salon': ['Haircut', 'Hair Color', 'Hair Spa', 'Facial'],
            'Carpenter': ['Furniture Repair', 'Door Installation', 'Cabinet Making'],
            'Cleaning': ['House Cleaning', 'Bathroom Cleaning', 'Kitchen Cleaning'],
          });
          return;
        }

        // Filter out categories without names
        const validCategories = categories.filter(cat => cat && (cat.name || cat.title));

        if (validCategories.length === 0) {
          // Use fallback if all categories are invalid
          const fallbackCategories = ['Electrician', 'Plumber', 'Salon', 'Carpenter', 'Cleaning'];
          setAvailableCategories(fallbackCategories);
          setSkillsByCategory({
            'Electrician': ['Fan Repair', 'AC', 'Lightings', 'Wiring', 'Switch Repair'],
            'Plumber': ['Tap Repair', 'Pipe Installation', 'Geyser Repair', 'Bathroom Fitting'],
            'Salon': ['Haircut', 'Hair Color', 'Hair Spa', 'Facial'],
            'Carpenter': ['Furniture Repair', 'Door Installation', 'Cabinet Making'],
            'Cleaning': ['House Cleaning', 'Bathroom Cleaning', 'Kitchen Cleaning'],
          });
          return;
        }

        // If single service mode, show only first category
        if (serviceConfig.mode === 'single' && validCategories.length > 0) {
          const firstCat = validCategories[0];
          setAvailableCategories([firstCat.name || firstCat.title]);
        } else {
          setAvailableCategories(validCategories.map(cat => cat.name || cat.title));
        }

        // Build skills mapping from categories
        const skillsMap = {};
        validCategories.forEach(cat => {
          const catName = cat.name || cat.title || '';
          // Handle both string arrays and object arrays
          const skills = (cat.skills || []).map(skill => {
            return typeof skill === 'string' ? skill : skill.name || skill;
          });
          // If no skills in category, add some default ones
          if (skills.length === 0) {
            skillsMap[catName] = ['General Service', 'Repair', 'Installation', 'Maintenance'];
          } else {
            skillsMap[catName] = skills;
          }
        });

        console.log('Skills map:', skillsMap);
        setSkillsByCategory(skillsMap);
      } catch (error) {
        console.error('Error loading service categories:', error);
        // Fallback to default
        const fallbackCategories = ['Electrician', 'Plumber', 'Salon', 'Carpenter', 'Cleaning'];
        setAvailableCategories(fallbackCategories);
        setSkillsByCategory({
          'Electrician': ['Fan Repair', 'AC', 'Lightings', 'Wiring', 'Switch Repair'],
          'Plumber': ['Tap Repair', 'Pipe Installation', 'Geyser Repair', 'Bathroom Fitting'],
          'Salon': ['Haircut', 'Hair Color', 'Hair Spa', 'Facial'],
          'Carpenter': ['Furniture Repair', 'Door Installation', 'Cabinet Making'],
          'Cleaning': ['House Cleaning', 'Bathroom Cleaning', 'Kitchen Cleaning'],
        });
      }
    };

    loadServiceCategories();
    window.addEventListener('serviceCategoriesUpdated', loadServiceCategories);
    window.addEventListener('adminUserAppCatalogUpdated', loadServiceCategories);

    return () => {
      window.removeEventListener('serviceCategoriesUpdated', loadServiceCategories);
      window.removeEventListener('adminUserAppCatalogUpdated', loadServiceCategories);
    };
  }, []);

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
        const workerProfile = JSON.parse(localStorage.getItem('workerProfile') || '{}');
        if (Object.keys(workerProfile).length > 0) {
          // Use actual saved values - don't override with defaults if values exist (even if empty)
          const category = workerProfile.serviceCategory ?? workerProfile.category ?? '';
          const skills = workerProfile.skills ?? [];

          console.log('EditProfile - Loading profile:', workerProfile);
          console.log('EditProfile - Category:', category, 'Skills:', skills);

          setFormData({
            name: workerProfile.name ?? 'Worker Name',
            phone: workerProfile.phone ?? '+91 9876543210',
            email: workerProfile.email ?? 'worker@example.com',
            address: workerProfile.address ?? 'Indore, Madhya Pradesh',
            serviceCategory: category,
            skills: Array.isArray(skills) ? skills : [],
          });
        } else {
          // Set default values if no profile exists (same as Profile page)
          setFormData({
            name: 'Worker Name',
            phone: '+91 9876543210',
            email: 'worker@example.com',
            address: 'Indore, Madhya Pradesh',
            serviceCategory: '',
            skills: [],
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Set defaults on error too
        setFormData({
          name: 'Worker Name',
          phone: '+91 9876543210',
          email: 'worker@example.com',
          address: 'Indore, Madhya Pradesh',
          serviceCategory: '',
          skills: [],
        });
      }
    };

    loadProfile();
    window.addEventListener('workerProfileUpdated', loadProfile);

    return () => {
      window.removeEventListener('workerProfileUpdated', loadProfile);
    };
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

  const handleCategoryChange = (category) => {
    console.log('Changing category to:', category);
    setFormData(prev => {
      const updated = {
        ...prev,
        serviceCategory: category,
        skills: [], // Reset skills when category changes
      };
      console.log('Updated formData:', updated);
      return updated;
    });
    // Clear error for this field
    if (errors.serviceCategory) {
      setErrors(prev => ({
        ...prev,
        serviceCategory: null,
      }));
    }
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => {
      const currentSkills = prev.skills || [];
      if (currentSkills.includes(skill)) {
        return {
          ...prev,
          skills: currentSkills.filter(s => s !== skill),
        };
      } else {
        return {
          ...prev,
          skills: [...currentSkills, skill],
        };
      }
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
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

    if (!formData.serviceCategory.trim()) {
      newErrors.serviceCategory = 'Service category is required';
    }

    if (!formData.skills || formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    try {
      // Load existing profile to preserve stats (rating, totalJobs, completedJobs, photo)
      const existingProfile = JSON.parse(localStorage.getItem('workerProfile') || '{}');

      const updatedProfile = {
        ...existingProfile,
        // Update editable fields (use actual form values, even if empty)
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        serviceCategory: formData.serviceCategory.trim(),
        skills: formData.skills,
        // Preserve stats and other fields
        rating: existingProfile.rating ?? 4.7,
        totalJobs: existingProfile.totalJobs ?? 0,
        completedJobs: existingProfile.completedJobs ?? 0,
        photo: existingProfile.photo ?? null,
        updatedAt: new Date().toISOString(),
      };

      console.log('EditProfile - Saving profile:', updatedProfile);
      localStorage.setItem('workerProfile', JSON.stringify(updatedProfile));
      window.dispatchEvent(new Event('workerProfileUpdated'));
      navigate('/worker/profile');
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
              className={`w-full px-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
              style={{ focusRingColor: themeColors.button }}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
              className={`w-full px-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500' : 'border-gray-200'
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
              className={`w-full px-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500' : 'border-gray-200'
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
              className={`w-full px-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 resize-none ${errors.address ? 'border-red-500' : 'border-gray-200'
                }`}
              style={{ focusRingColor: themeColors.button }}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Service Category */}
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
              <span>Service Category <span className="text-red-500">*</span></span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.length === 0 ? (
                <div className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-sm text-yellow-800">
                    Loading categories... If this persists, please add categories in the admin panel.
                  </p>
                </div>
              ) : (
                availableCategories.map((category) => {
                  const isSelected = formData.serviceCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Category clicked:', category);
                        handleCategoryChange(category);
                      }}
                      className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 cursor-pointer"
                      style={{
                        background: isSelected
                          ? `linear-gradient(135deg, ${themeColors.icon} 0%, ${themeColors.icon}dd 100%)`
                          : `linear-gradient(135deg, ${themeColors.icon}20 0%, ${themeColors.icon}10 100%)`,
                        color: isSelected ? '#FFFFFF' : themeColors.icon,
                        border: `1.5px solid ${isSelected ? themeColors.icon : `${themeColors.icon}40`}`,
                        boxShadow: isSelected
                          ? `0 2px 8px ${hexToRgba(themeColors.icon, 0.3)}`
                          : `0 2px 6px ${hexToRgba(themeColors.icon, 0.15)}`,
                        minWidth: '100px',
                      }}
                    >
                      {category}
                    </button>
                  );
                })
              )}
            </div>
            {errors.serviceCategory && (
              <p className="text-red-500 text-sm mt-1">{errors.serviceCategory}</p>
            )}
            {!formData.serviceCategory && !errors.serviceCategory && availableCategories.length > 0 && (
              <p className="text-gray-500 text-xs mt-2">Select a service category</p>
            )}
            {formData.serviceCategory && (
              <p className="text-green-600 text-xs mt-2">Selected: {formData.serviceCategory}</p>
            )}
          </div>

          {/* Skills */}
          {formData.serviceCategory && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.button}25 0%, ${themeColors.button}15 100%)`,
                  }}
                >
                  <FiTag className="w-4 h-4" style={{ color: themeColors.button }} />
                </div>
                <span>Skills <span className="text-red-500">*</span></span>
              </label>
              {(!skillsByCategory[formData.serviceCategory] || skillsByCategory[formData.serviceCategory].length === 0) ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-sm text-yellow-800">
                    No skills available for this category. Please add skills in the admin panel.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {(skillsByCategory[formData.serviceCategory] || []).map((skill) => {
                      const isSelected = formData.skills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95"
                          style={{
                            background: isSelected
                              ? `linear-gradient(135deg, ${themeColors.button} 0%, ${themeColors.button}dd 100%)`
                              : `linear-gradient(135deg, ${themeColors.button}20 0%, ${themeColors.button}10 100%)`,
                            color: isSelected ? '#FFFFFF' : themeColors.button,
                            border: `1.5px solid ${isSelected ? themeColors.button : `${themeColors.button}40`}`,
                            boxShadow: isSelected
                              ? `0 2px 8px ${hexToRgba(themeColors.button, 0.3)}`
                              : `0 2px 6px ${hexToRgba(themeColors.button, 0.15)}`,
                          }}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                  {errors.skills && (
                    <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
                  )}
                  {formData.skills.length === 0 && !errors.skills && (
                    <p className="text-gray-500 text-xs mt-2">Select at least one skill</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => navigate('/worker/profile')}
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


