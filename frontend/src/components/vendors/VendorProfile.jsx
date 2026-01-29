import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Star, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';

const API_URL = 'https://cafenova.onrender.com';

const VendorProfile = ({ onBack }) => {
  const [vendorProfile, setVendorProfile] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [selectedCafeIndex, setSelectedCafeIndex] = useState(0);
  const [error, setError] = useState('');

  // Fetch vendor profile and cafes on mount
  useEffect(() => {
    const vendorToken = localStorage.getItem('vendorToken');
    if (vendorToken) {
      fetchVendorProfile(vendorToken);
      fetchCafes(vendorToken);
    }
  }, []);

  // Fetch vendor profile
  const fetchVendorProfile = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/vendor/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setVendorProfile(data);
      } else {
        setError(data.message || 'Failed to fetch vendor profile');
      }
    } catch (err) {
      setError('Error fetching vendor profile: ' + err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch vendor cafes
  const fetchCafes = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/vendor/cafes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCafes(data.data || data.cafes || []);
      }
    } catch (err) {
      console.error('Error fetching cafes:', err);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!vendorProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Failed to load vendor profile</p>
        </div>
      </div>
    );
  }

  const currentCafe = cafes[selectedCafeIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-6 transition-all"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Vendor Profile Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left - Vendor Info */}
            <div>
              <h1 className="text-4xl font-bold text-green-700 mb-6">
                {vendorProfile.vendor?.name || 'Vendor'}
              </h1>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium">
                      {vendorProfile.vendor?.email || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800 font-medium">
                      {vendorProfile.vendor?.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Star size={20} className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Vendor Status</p>
                    <p className="text-gray-800 font-medium">
                      {vendorProfile.vendor?.status || 'Active'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Stats */}
            <div>
              {vendorProfile.data && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <p className="text-gray-600 text-sm font-semibold uppercase">Total Cafes</p>
                    <p className="text-3xl font-bold text-green-700 mt-2">
                      {vendorProfile.data.totalCafes || 0}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <p className="text-gray-600 text-sm font-semibold uppercase">Total Orders</p>
                    <p className="text-3xl font-bold text-blue-700 mt-2">
                      {vendorProfile.data.totalOrders || 0}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <p className="text-gray-600 text-sm font-semibold uppercase">Rating</p>
                    <p className="text-3xl font-bold text-purple-700 mt-2">
                      {vendorProfile.data.rating || '4.5'}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <p className="text-gray-600 text-sm font-semibold uppercase">Revenue</p>
                    <p className="text-3xl font-bold text-orange-700 mt-2">
                      {vendorProfile.data.revenue || '$0'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cafes Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-green-700 text-white p-8">
            <h2 className="text-3xl font-bold">Registered Cafes</h2>
            <p className="text-green-100 mt-2">Total: {cafes.length} cafe(s)</p>
          </div>

          {cafes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
              {/* Cafe List - Left Sidebar */}
              <div className="lg:col-span-1 bg-gray-50 border-r">
                <div className="sticky top-0 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {cafes.map((cafe, index) => (
                    <button
                      key={cafe.id}
                      onClick={() => setSelectedCafeIndex(index)}
                      className={`w-full text-left p-4 border-b transition-all ${
                        selectedCafeIndex === index
                          ? 'bg-green-100 border-l-4 border-l-green-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <p className="font-semibold text-gray-800 truncate">
                        {cafe.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {cafe.city || 'N/A'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cafe Details - Right Content */}
              <div className="lg:col-span-3 p-8">
                {currentCafe ? (
                  <div className="space-y-8">
                    {/* Cafe Image */}
                    {currentCafe.image && (
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={currentCafe.image}
                          alt={currentCafe.name}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}

                    {/* Cafe Name */}
                    <div>
                      <h3 className="text-3xl font-bold text-green-700 mb-2">
                        {currentCafe.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {currentCafe.description || 'No description available'}
                      </p>
                    </div>

                    {/* Location Details */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                          Address
                        </p>
                        <p className="text-gray-800 flex items-start gap-2">
                          <MapPin size={18} className="text-green-600 shrink-0 mt-1" />
                          {currentCafe.location || currentCafe.address || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                          City
                        </p>
                        <p className="text-gray-800">
                          {currentCafe.city || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                          State
                        </p>
                        <p className="text-gray-800">
                          {currentCafe.state || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                          Pincode
                        </p>
                        <p className="text-gray-800">
                          {currentCafe.pincode || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                          Latitude
                        </p>
                        <p className="text-gray-800 font-mono">
                          {currentCafe.latitude || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                          Longitude
                        </p>
                        <p className="text-gray-800 font-mono">
                          {currentCafe.longitude || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No cafe selected</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg">
                No cafes registered yet. Register your first cafe to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
