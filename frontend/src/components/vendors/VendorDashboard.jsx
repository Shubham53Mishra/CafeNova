import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Menu, BarChart3, Users, Settings, LogOut, ChevronDown, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const API_URL = 'https://cafenova.onrender.com';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const vendorToken = localStorage.getItem('vendorToken');
    if (vendorToken) {
      setIsLoggedIn(true);
      fetchVendorData(vendorToken);
    } else {
      navigate('/vendors/login');
    }
  }, [navigate]);

  const fetchVendorData = async (token) => {
    try {
      const [profileRes, cafesRes] = await Promise.all([
        fetch(`${API_URL}/api/vendor/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/api/vendor/cafes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
      ]);

      const profileData = await profileRes.json();
      const cafesData = await cafesRes.json();

      if (profileRes.ok) {
        setVendorProfile(profileData);
      }

      if (cafesRes.ok) {
        const cafesList = cafesData.data || cafesData.cafes || [];
        setCafes(cafesList);
        if (cafesList.length > 0) {
          setSelectedCafe(cafesList[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorEmail');
    navigate('/vendors/login');
  };

  if (!isLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 overflow-y-auto`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h2 className="text-xl font-bold text-green-700">CafeNova</h2>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="p-4 space-y-2">
            {[
              { icon: BarChart3, label: 'Dashboard', id: 'overview' },
              { icon: Menu, label: 'Menu Items', id: 'menu' },
              { icon: Users, label: 'Orders', id: 'orders' },
              { icon: Settings, label: 'Settings', id: 'settings' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Cafes List */}
          {sidebarOpen && (
            <div className="p-4 mt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Your Cafes</h3>
              <div className="space-y-2">
                {cafes.map((cafe) => (
                  <button
                    key={cafe._id}
                    onClick={() => setSelectedCafe(cafe)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      selectedCafe?._id === cafe._id
                        ? 'bg-green-50 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cafe.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition ${
                !sidebarOpen && 'justify-center'
              }`}
            >
              <LogOut size={20} />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="p-8">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {vendorProfile?.vendor?.name}</p>
              </div>

              {selectedCafe && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {/* Stats Cards */}
                  {[
                    { label: 'Total Orders', value: '1,234', color: 'bg-blue-50', textColor: 'text-blue-700' },
                    { label: 'Revenue', value: '₹45,000', color: 'bg-green-50', textColor: 'text-green-700' },
                    { label: 'Active Menus', value: '8', color: 'bg-purple-50', textColor: 'text-purple-700' },
                    { label: 'Avg Rating', value: '4.5', color: 'bg-orange-50', textColor: 'text-orange-700' }
                  ].map((stat, idx) => (
                    <div key={idx} className={`${stat.color} rounded-lg p-6`}>
                      <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                      <p className={`${stat.textColor} text-3xl font-bold`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Cafe Overview */}
              {selectedCafe && (
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedCafe.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Cafe Information</h3>
                      <div className="space-y-3 text-sm">
                        <p><span className="font-medium text-gray-600">Address:</span> {selectedCafe.address || 'N/A'}</p>
                        <p><span className="font-medium text-gray-600">City:</span> {selectedCafe.city || 'N/A'}</p>
                        <p><span className="font-medium text-gray-600">State:</span> {selectedCafe.state || 'N/A'}</p>
                        <p><span className="font-medium text-gray-600">Pincode:</span> {selectedCafe.pincode || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Description</h3>
                      <p className="text-gray-600 text-sm">{selectedCafe.description || 'No description available'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">Food Menu</h1>
                  <p className="text-gray-600 mt-2">Manage your cafe menu items</p>
                </div>
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2">
                  <Plus size={20} />
                  Add New Category
                </button>
              </div>

              {/* Menu Categories */}
              <div className="space-y-6">
                {['Breakfast', 'Lunch', 'Dinner', 'Beverages'].map((category, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-linear-to-r from-green-50 to-green-100 p-6 flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{category}</h3>
                        <p className="text-gray-600 text-sm">0 items</p>
                      </div>
                      <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2">
                        <Plus size={18} />
                        Add Item
                      </button>
                    </div>
                    <div className="p-6 text-center text-gray-500">
                      <p>No items in this category yet</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Orders</h1>
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-gray-600 text-lg">No orders yet</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Settings</h1>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Cafe Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cafe Name</label>
                    <input
                      type="text"
                      value={selectedCafe?.name || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={selectedCafe?.description || ''}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
