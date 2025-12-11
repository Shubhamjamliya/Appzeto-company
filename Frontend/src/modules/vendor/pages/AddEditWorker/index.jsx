import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX } from 'react-icons/fi';
import { vendorTheme as themeColors } from '../../../../theme';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';

const AddEditWorker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    skills: [],
    serviceArea: '',
    workingHours: {
      start: '09:00',
      end: '18:00',
    },
    availability: 'ONLINE',
  });

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
    if (isEdit) {
      const loadWorker = () => {
        try {
          const workers = JSON.parse(localStorage.getItem('vendorWorkers') || '[]');
          const worker = workers.find(w => w.id === id);
          if (worker) {
            setFormData({
              name: worker.name || '',
              phone: worker.phone || '',
              skills: worker.skills || [],
              serviceArea: worker.serviceArea || '',
              workingHours: worker.workingHours || { start: '09:00', end: '18:00' },
              availability: worker.availability || 'ONLINE',
            });
          }
        } catch (error) {
          console.error('Error loading worker:', error);
        }
      };
      loadWorker();
    }
  }, [id, isEdit]);

  const availableSkills = [
    'Fan Repair',
    'AC Service',
    'Electrical Wiring',
    'Plumbing',
    'Carpentry',
    'Appliance Repair',
    'Cleaning',
    'Installation',
  ];

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

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (formData.skills.length === 0) {
      newErrors.skills = 'Select at least one skill';
    }
    
    if (!formData.serviceArea.trim()) {
      newErrors.serviceArea = 'Service area is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    try {
      const workers = JSON.parse(localStorage.getItem('vendorWorkers') || '[]');
      
      if (isEdit) {
        const updated = workers.map(w => 
          w.id === id ? { ...w, ...formData, updatedAt: new Date().toISOString() } : w
        );
        localStorage.setItem('vendorWorkers', JSON.stringify(updated));
      } else {
        const newWorker = {
          id: Date.now().toString(),
          ...formData,
          stats: {
            jobsCompleted: 0,
            rating: null,
            complaints: 0,
          },
          currentJob: null,
          createdAt: new Date().toISOString(),
        };
        workers.push(newWorker);
        localStorage.setItem('vendorWorkers', JSON.stringify(workers));
      }
      
      window.dispatchEvent(new Event('vendorWorkersUpdated'));
      navigate('/vendor/workers');
    } catch (error) {
      console.error('Error saving worker:', error);
      alert('Failed to save worker. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: themeColors.backgroundGradient }}>
      <Header title={isEdit ? 'Edit Worker' : 'Add Worker'} />

      <main className="px-4 py-6">
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Worker Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter worker name"
              className={`w-full px-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{ focusRingColor: themeColors.button }}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter mobile number"
              className={`w-full px-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 ${
                errors.phone ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{ focusRingColor: themeColors.button }}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skills <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    formData.skills.includes(skill)
                      ? 'text-white'
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                  style={
                    formData.skills.includes(skill)
                      ? {
                          background: themeColors.button,
                          boxShadow: `0 2px 8px ${themeColors.button}40`,
                        }
                      : {}
                  }
                >
                  {skill}
                </button>
              ))}
            </div>
            {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
          </div>

          {/* Service Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Area <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.serviceArea}
              onChange={(e) => handleInputChange('serviceArea', e.target.value)}
              placeholder="Enter service area (e.g., Indore, MP)"
              className={`w-full px-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 ${
                errors.serviceArea ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{ focusRingColor: themeColors.button }}
            />
            {errors.serviceArea && <p className="text-red-500 text-sm mt-1">{errors.serviceArea}</p>}
          </div>

          {/* Working Hours */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Working Hours
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                <input
                  type="time"
                  value={formData.workingHours.start}
                  onChange={(e) => handleInputChange('workingHours', { ...formData.workingHours, start: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                  style={{ focusRingColor: themeColors.button }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">End Time</label>
                <input
                  type="time"
                  value={formData.workingHours.end}
                  onChange={(e) => handleInputChange('workingHours', { ...formData.workingHours, end: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                  style={{ focusRingColor: themeColors.button }}
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Availability
            </label>
            <div className="flex gap-3">
              {['ONLINE', 'OFFLINE'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleInputChange('availability', status)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    formData.availability === status
                      ? 'text-white'
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                  style={
                    formData.availability === status
                      ? {
                          background: themeColors.button,
                          boxShadow: `0 2px 8px ${themeColors.button}40`,
                        }
                      : {}
                  }
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{
              background: themeColors.button,
              boxShadow: `0 4px 12px ${themeColors.button}40`,
            }}
          >
            <FiSave className="w-5 h-5" />
            {isEdit ? 'Update Worker' : 'Add Worker'}
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AddEditWorker;

