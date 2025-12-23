import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiPlus, FiMoreVertical, FiEdit2, FiTrash2, FiMapPin, FiNavigation } from 'react-icons/fi';
import AddressFormModal from '../../components/common/AddressFormModal';
import { userAuthService } from '../../../../services/authService';

const ManageAddresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMenu, setShowMenu] = useState(null); // Address ID for which menu is open
  const [editingAddress, setEditingAddress] = useState(null);

  // Fetch addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await userAuthService.getProfile();
        if (response.success && response.user?.addresses) {
          // Map DB addresses to frontend format
          const mapped = response.user.addresses.map(addr => ({
            id: addr._id || addr.id,
            label: addr.type.charAt(0).toUpperCase() + addr.type.slice(1),
            address: `${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}, ${addr.city}, ${addr.state} - ${addr.pincode}`,
            name: response.user.name,
            phone: response.user.phone
          }));
          setAddresses(mapped);
        }
      } catch (error) {
        toast.error('Failed to load addresses');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocode using Google Maps API
          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );
          const data = await response.json();

          if (data.status === 'OK' && data.results.length > 0) {
            setCurrentLocation(data.results[0].formatted_address);
            toast.success('Current location detected!');
          } else {
            toast.error('Could not determine address from location');
          }
        } catch (error) {
          toast.error('Error detecting address');
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        toast.error('Permission denied or location toggle off');
      }
    );
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = (formData) => {
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr =>
        addr.id === editingAddress.id
          ? { ...editingAddress, ...formData }
          : addr
      ));
      toast.success('Address updated successfully!');
    } else {
      // Add new address
      const newAddress = {
        id: Date.now(),
        ...formData
      };
      setAddresses([...addresses, newAddress]);
      toast.success('Address added successfully!');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowMenu(null);
    setShowAddModal(true);
  };

  const handleDelete = (addressId) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
    setShowMenu(null);
    toast.success('Address deleted successfully!');
  };

  const handleMenuToggle = (addressId) => {
    setShowMenu(showMenu === addressId ? null : addressId);
  };

  return (
    <div className="min-h-screen bg-white pb-4">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-black" />
            </button>
            <h1 className="text-xl font-bold text-black">Manage Addresses</h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* Current Location Section */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Current Location</h2>
          <div
            className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl cursor-pointer active:scale-[0.98] transition-all"
            onClick={handleGetCurrentLocation}
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <FiNavigation className={`w-5 h-5 text-blue-600 ${isDetecting ? 'animate-pulse' : ''}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-blue-900">
                {isDetecting ? 'Detecting location...' : 'Use current location'}
              </h3>
              <p className="text-sm text-blue-700 mt-0.5 line-clamp-2">
                {currentLocation || 'Allow access to your device location for accurate service delivery.'}
              </p>
            </div>
          </div>
        </div>

        {/* Saved Addresses Section */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Saved Addresses</h2>
          <button
            onClick={handleAddAddress}
            className="flex items-center gap-1.5 text-sm font-bold text-purple-600"
          >
            <FiPlus className="w-4 h-4" />
            Add New
          </button>
        </div>

        {/* Loading State */}
        {loading && addresses.length === 0 && (
          <div className="py-10 text-center">
            <div className="w-8 h-8 border-4 border-gray-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-500">Loading your addresses...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && addresses.length === 0 && (
          <div className="py-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <FiMapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">No saved addresses yet</p>
          </div>
        )}

        {/* Address List */}
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white border border-gray-200 rounded-xl p-4 relative"
            >
              {/* Menu Button */}
              <button
                onClick={() => handleMenuToggle(address.id)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiMoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {/* Menu Dropdown */}
              {showMenu === address.id && (
                <div className="absolute top-12 right-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                  <button
                    onClick={() => handleEdit(address)}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FiEdit2 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors text-left text-red-600"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              )}

              {/* Address Content */}
              <div className="pr-12">
                <h3 className="text-base font-bold text-black mb-2">{address.label}</h3>
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">{address.address}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{address.name}</span>
                  <span>•</span>
                  <span>{address.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add/Edit Address Modal */}
      <AddressFormModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        address={editingAddress}
        onSave={handleSaveAddress}
      />

      {/* Close menu when clicking outside */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(null)}
        />
      )}
    </div>
  );
};

export default ManageAddresses;

