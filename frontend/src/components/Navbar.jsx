import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Coffee, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('Getting location...');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [vendorEmail, setVendorEmail] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // Check if vendor or user is logged in
    const vendorToken = localStorage.getItem('vendorToken');
    const vendorEmailStored = localStorage.getItem('vendorEmail');
    const userToken = localStorage.getItem('userToken');
    const userEmailStored = localStorage.getItem('userEmail');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (vendorToken && vendorEmailStored) {
      setVendorEmail(vendorEmailStored);
    } else if (userToken && userEmailStored) {
      setUserEmail(userEmailStored);
    }

    // Set timeout to fallback after 5 seconds
    const timer = setTimeout(() => {
      setLocation('Ahmedabad');
      console.log('Location fetch timeout - showing Ahmedabad');
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timer);
        const { latitude, longitude } = position.coords;
        console.log('Got location:', latitude, longitude);
        
        // Use OpenStreetMap Nominatim for reverse geocoding (free, no API key)
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              'User-Agent': 'CafeNova-App'
            }
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log('Full address data:', data.address);
            const address = data.address || {};
            
            // Try to get city from different address fields
            let city = 
              address.city || 
              address.town || 
              address.village ||
              address.city_district ||
              address.county ||
              address.district ||
              address.state ||
              'Ahmedabad';
            
            console.log('City found:', city);
            setLocation(city);
          })
          .catch((error) => {
            console.error('Error fetching location:', error);
            setLocation('Ahmedabad');
          });
      },
      (error) => {
        clearTimeout(timer);
        console.error('Geolocation error:', error);
        setLocation('Ahmedabad');
      }
    );

    return () => clearTimeout(timer);
  }, []);

  const cities = [
    'Ahmedabad',
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune'
  ];

  return (
    <nav className="bg-white shadow-md">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity duration-300">
            <Coffee size={40} className="text-green-700 drop-shadow-lg" />
            <h1 className="text-4xl font-black bg-linear-to-r from-green-600 to-green-800 bg-clip-text text-transparent hover:from-green-500 hover:to-green-700 transition-all duration-300 transform hover:scale-110 drop-shadow-lg tracking-tight">
              CafeNova
            </h1>
          </div>

          {/* Center Section - Location and Search */}
          <div className="flex-1 mx-8 flex items-center gap-4">
            {/* Location Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                <MapPin size={18} className="text-green-500" />
                <span className="text-sm font-medium text-green-800">{location}</span>
                <ChevronDown size={16} className="text-green-800" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setLocation(city);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                        location === city ? 'bg-green-50 text-green-700 font-semibold' : 'text-green-800'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 transition-all duration-300 ease-in-out hover:bg-gray-200 hover:shadow-lg transform hover:scale-105 focus-within:border-2 focus-within:border-green-600">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for restaurant, cuisine or a dish"
                  className="flex-1 ml-2 bg-transparent outline-none text-sm placeholder-gray-400 text-green-800"
                />
              </div>
            </div>
          </div>

          {/* Right Section - Auth Links */}
          <div className="flex items-center gap-4">
            {vendorEmail ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-green-700">{vendorEmail}</span>
                <button
                  onClick={() => {
                    localStorage.removeItem('vendorToken');
                    localStorage.removeItem('vendorEmail');
                    navigate('/');
                    window.location.reload();
                  }}
                  className="text-green-600 hover:text-red-600 transition-colors duration-300"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : userEmail ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-green-700">{userEmail}</span>
                <button
                  onClick={() => {
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('userEmail');
                    navigate('/');
                    window.location.reload();
                  }}
                  className="text-green-600 hover:text-red-600 transition-colors duration-300"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-medium bg-green-700 text-white hover:text-green-600 transition-all duration-300 ease-in-out hover:bg-green-50 px-4 py-2 rounded-lg transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 inline-block"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-green-700 text-white rounded-lg font-medium hover:text-green-600 transition-all duration-300 ease-in-out hover:bg-green-50 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Navigation - Tabs */}
      {!vendorEmail && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8">
              <Link
                to="/vendors"
                className="py-4 px-2 border-b-4 border-green-600 text-green-700 font-semibold text-sm hover:opacity-80 transition"
              >
                🍽️ Dining Out
              </Link>
              <button className="py-4 px-2 border-b-4 border-transparent text-green-800 font-semibold text-sm hover:border-gray-300 transition">
                🚚 Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;