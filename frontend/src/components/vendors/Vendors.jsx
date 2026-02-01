import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, AlertCircle, CheckCircle, MapPinned } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Country, State, City } from 'country-state-city';

const API_URL = 'https://cafenova.onrender.com';

const Vendors = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [vendorProfile, setVendorProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [cafes, setCafes] = useState([]);
  const [cafesLoading, setCafesLoading] = useState(false);
  useEffect(() => {
    const vendorToken = localStorage.getItem('vendorToken');
    if (vendorToken) {
      setIsLoggedIn(true);
      // Fetch vendor profile
      fetchVendorProfile(vendorToken);
      // Fetch cafes list
      fetchCafes(vendorToken);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch vendor profile
  const fetchVendorProfile = async (token) => {
    setProfileLoading(true);
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
      console.error('Profile fetch error:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch vendor cafes
  const fetchCafes = async (token) => {
    setCafesLoading(true);
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
      } else {
        console.error('Failed to fetch cafes:', data.message);
      }
    } catch (err) {
      console.error('Error fetching cafes:', err);
    } finally {
      setCafesLoading(false);
    }
  };

  // Cafe registration removed - can be added back if needed
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Check if vendor is logged in */}
        {!isLoggedIn ? (
            // Show login prompt
            <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
              <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 text-center">
                <h2 className="text-3xl font-bold text-green-700 mb-4">
                  Vendor Dashboard
                </h2>
                <p className="text-gray-600 mb-6">
                  Please log in to access your vendor dashboard and register cafes.
                </p>
                <a href="/vendors/login" className="inline-block bg-green-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-800 transition-all">
                  Login Here
                </a>
              </div>
            </div>
          ) : (
            <>
            {profileLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Loading vendor profile...</p>
              </div>
            ) : vendorProfile ? (
              <div>
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                      Welcome, {vendorProfile.vendor?.name || 'Vendor'}
                    </h1>
                    <p className="text-gray-600 mb-6">
                      Email: {vendorProfile.vendor?.email || 'N/A'}
                    </p>

                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                        <AlertCircle size={18} />
                        {error}
                      </div>
                    )}
                  </div>

                  {/* Stats Section */}
                  {vendorProfile.data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Total Cafes</p>
                        <p className="text-3xl font-bold text-green-700">
                          {vendorProfile.data.totalCafes || 0}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Total Orders</p>
                        <p className="text-3xl font-bold text-blue-700">
                          {vendorProfile.data.totalOrders || 0}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Registration Form - Removed */}

                {/* Cafes List */}
                {cafesLoading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">Loading cafes...</p>
                  </div>
                ) : cafes && cafes.length > 0 ? (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">
                      Your Cafes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {cafes.map((cafe) => (
                        <div
                          key={cafe._id}
                          className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-200"
                        >
                          {/* Cafe Image */}
                          <div className="relative overflow-hidden h-48 bg-gray-200">
                            {cafe.image ? (
                              <img
                                src={cafe.image}
                                alt={cafe.name}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-green-100 to-green-200">
                                <MapPin size={48} className="text-green-700 opacity-50" />
                              </div>
                            )}
                          </div>

                          {/* Cafe Info */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-green-700 mb-2">
                              {cafe.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {cafe.description || 'No description available'}
                            </p>
                            <div className="flex items-start gap-2 text-gray-700 mb-4">
                              <MapPin size={18} className="text-green-600 shrink-0 mt-0.5" />
                              <p className="text-sm">
                                {cafe.location || cafe.address || 'No address provided'}
                              </p>
                            </div>
                            <button
                              onClick={() => navigate(`/vendors/cafe/${cafe._id}`)}
                              className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 rounded-lg p-8 text-center border border-green-200">
                    <p className="text-green-600 text-lg font-medium">
                      No cafes registered yet. Click "Register New Cafe" to get started!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Failed to load vendor profile</p>
              </div>
            )}
            </>
          )}
      </div>
    </div>
  );
};

export default Vendors;