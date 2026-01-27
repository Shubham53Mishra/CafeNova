import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';

const API_URL = 'https://cafenova.onrender.com';

const Vendors = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cafeName, setCafeName] = useState('');
  const [cafeDescription, setCafeDescription] = useState('');
  const [cafeLocation, setCafeLocation] = useState('');
  const [cafeImage, setCafeImage] = useState('');
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [vendorProfile, setVendorProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Check if vendor is logged in
  useEffect(() => {
    const vendorToken = localStorage.getItem('vendorToken');
    if (vendorToken) {
      setIsLoggedIn(true);
      // Fetch vendor profile
      fetchVendorProfile(vendorToken);
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

  // Handle cafe registration
  const handleCafeRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setError('');
    setSuccess('');

    try {
      const vendorToken = localStorage.getItem('vendorToken');
      const response = await fetch(`${API_URL}/api/vendor/register-cafe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vendorToken}`,
        },
        body: JSON.stringify({
          name: cafeName,
          description: cafeDescription,
          location: cafeLocation,
          image: cafeImage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Cafe registered successfully!');
        setCafeName('');
        setCafeDescription('');
        setCafeLocation('');
        setCafeImage('');
        // Refresh page or update state to show cafes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        let errorMsg = data.message || data.error || 'Failed to register cafe';
        if (data.errors) {
          errorMsg = Object.values(data.errors).flat().join(', ');
        }
        setError(errorMsg);
      }
    } catch (err) {
      setError('Server error: ' + err.message);
      console.error('Register error:', err);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Check if vendor is logged in */}
        {!isLoggedIn ? (
          // Cafe Registration Form
          <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-green-700 text-center mb-2">
                Register Your Cafe
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Please log in first to register your cafe
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                  <CheckCircle size={18} />
                  {success}
                </div>
              )}

              <form onSubmit={handleCafeRegister} className="space-y-6">
                {/* Cafe Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cafe Name
                  </label>
                  <input
                    type="text"
                    value={cafeName}
                    onChange={(e) => setCafeName(e.target.value)}
                    placeholder="Enter your cafe name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    required
                  />
                </div>

                {/* Cafe Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={cafeDescription}
                    onChange={(e) => setCafeDescription(e.target.value)}
                    placeholder="Describe your cafe"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    required
                  />
                </div>

                {/* Cafe Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={cafeLocation}
                    onChange={(e) => setCafeLocation(e.target.value)}
                    placeholder="Enter your cafe location"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    required
                  />
                </div>

                {/* Cafe Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={cafeImage}
                    onChange={(e) => setCafeImage(e.target.value)}
                    placeholder="Enter image URL"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={registering}
                  className="w-full bg-green-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registering ? 'Registering...' : 'Register Cafe'}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Not logged in?{' '}
                  <a href="/vendors/login" className="text-green-600 hover:text-green-700 font-bold">
                    Login here
                  </a>
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Show Vendor Dashboard if logged in
          <div>
            {profileLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Loading vendor profile...</p>
              </div>
            ) : vendorProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="md:col-span-3">
                  <div className="bg-white rounded-lg shadow-lg p-8">
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

                    {/* Cafes List */}
                    {vendorProfile.cafes && vendorProfile.cafes.length > 0 && (
                      <div className="mt-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                          Your Cafes
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {vendorProfile.cafes.map((cafe) => (
                            <div
                              key={cafe.id}
                              className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                            >
                              {cafe.image && (
                                <img
                                  src={cafe.image}
                                  alt={cafe.name}
                                  className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                              )}
                              <h3 className="text-lg font-bold text-gray-800">{cafe.name}</h3>
                              <p className="text-gray-600 text-sm mb-2">
                                {cafe.description}
                              </p>
                              <p className="text-gray-600 flex items-center gap-2 text-sm">
                                <MapPin size={16} />
                                {cafe.location}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Failed to load vendor profile</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendors;
