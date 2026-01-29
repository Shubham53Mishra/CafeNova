import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, AlertCircle, CheckCircle, MapPinned } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { Country, State, City } from 'country-state-city';

const API_URL = 'https://cafenova.onrender.com';

const Vendors = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cafeName, setCafeName] = useState('');
  const [cafeDescription, setCafeDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [cafeImages, setCafeImages] = useState([]);
  const [registering, setRegistering] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [vendorProfile, setVendorProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(true);
  const [cafes, setCafes] = useState([]);
  const [cafesLoading, setCafesLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countryCode, setCountryCode] = useState('IN');
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

  // Handle cafe registration
  const handleCafeRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setError('');
    setSuccess('');

    try {
      const vendorToken = localStorage.getItem('vendorToken');
      
      // Step 1: Register Cafe
      const response = await fetch(`${API_URL}/api/vendor/cafe/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vendorToken}`,
        },
        body: JSON.stringify({
          cafe_name: cafeName,
          cafe_description: cafeDescription,
          address: address,
          city: city,
          state: state,
          pincode: pincode,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const cafeId = data.cafe_id || data.data?.id || data.id;
        setSuccess('Cafe registered successfully!');
        
        // Step 2: Upload images if provided
        if (cafeImages.length > 0 && cafeId) {
          await uploadCafeImages(cafeId, vendorToken);
        } else {
          // Clear form and reload
          clearCafeForm();
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
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

  // Upload cafe images
  const uploadCafeImages = async (cafeId, token) => {
    setUploading(true);
    try {
      const formData = new FormData();
      cafeImages.forEach((image) => {
        formData.append('images[]', image);
      });

      const response = await fetch(`${API_URL}/api/vendor/cafe/${cafeId}/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Cafe and images uploaded successfully!');
        clearCafeForm();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(data.message || 'Failed to upload images');
      }
    } catch (err) {
      setError('Error uploading images: ' + err.message);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  // Clear cafe form
  const clearCafeForm = () => {
    setCafeName('');
    setCafeDescription('');
    setAddress('');
    setCity('');
    setState('');
    setPincode('');
    setLatitude('');
    setLongitude('');
    setCafeImages([]);
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setCafeImages(files);
  };

  // Initialize countries and states on component mount
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries || []);
    
    // Load states for India by default
    const allStates = State.getStatesOfCountry('IN');
    setStates(allStates || []);
  }, []);

  // Handle state change and update cities
  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setState(stateName);
    
    // Get cities for selected state
    if (stateName) {
      const citiesList = City.getCitiesOfState('IN', stateName);
      setCities(citiesList || []);
      setCity(''); // Reset city when state changes
    } else {
      setCities([]);
    }
  };

  // Handle country change and update states
  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setCountryCode(countryCode);
    setState(''); // Reset state
    setCity(''); // Reset city
    
    // Get states for selected country
    if (countryCode) {
      const countryStates = State.getStatesOfCountry(countryCode);
      setStates(countryStates || []);
    } else {
      setStates([]);
    }
  };

  // Handle city change
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  // Get current location and auto-fill latitude/longitude
  const handleGetLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat.toString());
          setLongitude(lng.toString());
          setSuccess('Location auto-filled successfully!');
          setTimeout(() => setSuccess(''), 3000);
          setGettingLocation(false);
        },
        (error) => {
          setError('Unable to get your location. Please check your browser permissions.');
          console.error('Geolocation error:', error);
          setGettingLocation(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setGettingLocation(false);
    }
  };

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
          // Show Vendor Dashboard if logged in
          <div>
            {profileLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Loading vendor profile...</p>
              </div>
            ) : vendorProfile ? (
              <div>
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <div className="flex justify-between items-start">
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

                      {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                          <CheckCircle size={18} />
                          {success}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setShowRegistrationForm(!showRegistrationForm)}
                      className="bg-green-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-800 transition-all"
                    >
                      {showRegistrationForm ? 'Hide Form' : 'Register New Cafe'}
                    </button>
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

                {/* Registration Form - Toggle */}
                {showRegistrationForm && (
                  <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-green-700 mb-6">
                      Register New Cafe
                    </h2>

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

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter your cafe address"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          required
                        />
                      </div>

                      {/* Country, State, City, Pincode */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <select
                            value={countryCode}
                            onChange={handleCountryChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            required
                          >
                            <option value="">Select Country</option>
                            {countries.map((country) => (
                              <option key={country.isoCode} value={country.isoCode}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <select
                            value={state}
                            onChange={handleStateChange}
                            disabled={!countryCode}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required
                          >
                            <option value="">Select State</option>
                            {states.map((st) => (
                              <option key={st.isoCode} value={st.isoCode}>
                                {st.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <select
                            value={city}
                            onChange={handleCityChange}
                            disabled={!state}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required
                          >
                            <option value="">Select City</option>
                            {cities.map((c) => (
                              <option key={c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pincode
                          </label>
                          <input
                            type="text"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            placeholder="Enter pincode"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      {/* Latitude, Longitude */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Latitude
                          </label>
                          <input
                            type="number"
                            step="0.0001"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            placeholder="e.g., 12.9716"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Longitude
                          </label>
                          <input
                            type="number"
                            step="0.0001"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            placeholder="e.g., 77.5946"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      {/* Get Current Location Button */}
                      <div>
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={gettingLocation}
                          className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MapPinned size={18} />
                          {gettingLocation ? 'Getting Location...' : 'Auto-fill Current Location'}
                        </button>
                        <p className="text-xs text-gray-500 mt-1">Click to auto-fill latitude & longitude from your current location</p>
                      </div>

                      {/* Cafe Images */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cafe Images (Multiple)
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        />
                        {cafeImages.length > 0 && (
                          <p className="mt-2 text-sm text-green-600">
                            {cafeImages.length} image(s) selected
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={registering || uploading}
                        className="w-full bg-green-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {registering || uploading ? 'Processing...' : 'Register Cafe'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Cafes List */}
                {cafesLoading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">Loading cafes...</p>
                  </div>
                ) : cafes && cafes.length > 0 ? (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Your Cafes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cafes.map((cafe) => (
                        <div
                          key={cafe.id}
                          className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
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
                            {cafe.location || cafe.address}
                          </p>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendors;
