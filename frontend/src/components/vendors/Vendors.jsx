import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';

const API_URL = 'https://cafenova.onrender.com';

const Vendors = () => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cafeName, setCafeName] = useState('');
  const [cafeDescription, setCafeDescription] = useState('');
  const [cafeLocation, setCafeLocation] = useState('');
  const [cafeImage, setCafeImage] = useState('');
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if vendor is logged in
  useEffect(() => {
    const vendorToken = localStorage.getItem('vendorToken');
    if (vendorToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

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

  const vendors = [
    {
      id: 1,
      name: 'Café Bliss',
      cuisine: 'Italian Cafe',
      rating: 4.8,
      deliveryTime: '25-30 mins',
      distance: '2.5 km',
      image: 'https://via.placeholder.com/300x200?text=Cafe+Bliss'
    },
    {
      id: 2,
      name: 'The Coffee House',
      cuisine: 'Coffee & Snacks',
      rating: 4.6,
      deliveryTime: '20-25 mins',
      distance: '1.8 km',
      image: 'https://via.placeholder.com/300x200?text=Coffee+House'
    },
    {
      id: 3,
      name: 'Brew & Bake',
      cuisine: 'Bakery & Coffee',
      rating: 4.7,
      deliveryTime: '30-35 mins',
      distance: '3.2 km',
      image: 'https://via.placeholder.com/300x200?text=Brew+Bake'
    },
    {
      id: 4,
      name: 'Espresso Express',
      cuisine: 'Premium Coffee',
      rating: 4.9,
      deliveryTime: '15-20 mins',
      distance: '1.2 km',
      image: 'https://via.placeholder.com/300x200?text=Espresso+Express'
    },
    {
      id: 5,
      name: 'Café Mocha',
      cuisine: 'Chocolate & Coffee',
      rating: 4.5,
      deliveryTime: '25-30 mins',
      distance: '2.0 km',
      image: 'https://via.placeholder.com/300x200?text=Cafe+Mocha'
    },
    {
      id: 6,
      name: 'Urban Café',
      cuisine: 'Modern Cafe',
      rating: 4.7,
      deliveryTime: '20-25 mins',
      distance: '1.5 km',
      image: 'https://via.placeholder.com/300x200?text=Urban+Cafe'
    }
  ];

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
          // Show Cafes List if logged in
          <>
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Popular Vendors</h2>
              <p className="text-gray-600">Discover delicious cafes near you</p>
            </div>

            {/* Vendors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              onClick={() => setSelectedVendor(vendor)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                  <Star size={16} fill="white" />
                  {vendor.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {vendor.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{vendor.cuisine}</p>

                {/* Details */}
                <div className="flex items-center gap-4 text-sm text-gray-700 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-green-600" />
                    {vendor.deliveryTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-red-500" />
                    {vendor.distance}
                  </div>
                </div>

                {/* Button */}
                <button className="w-full bg-green-700 text-white py-2 rounded-lg font-medium hover:bg-green-800 transition-all duration-300 transform hover:scale-105">
                  View Menu
                </button>
              </div>
            </div>
          ))}
            </div>

            {/* Modal */}
            {selectedVendor && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-md w-full p-6">
                  <h2 className="text-2xl font-bold mb-2">{selectedVendor.name}</h2>
                  <p className="text-gray-600 mb-4">{selectedVendor.cuisine}</p>
                  <div className="flex justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Star size={20} className="text-yellow-400" fill="currentColor" />
                      <span className="font-bold">{selectedVendor.rating}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Delivery Time</p>
                      <p className="font-semibold">{selectedVendor.deliveryTime}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedVendor(null)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                      Close
                    </button>
                    <button className="flex-1 bg-green-700 text-white py-2 rounded-lg font-medium hover:bg-green-800 transition">
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Vendors;
