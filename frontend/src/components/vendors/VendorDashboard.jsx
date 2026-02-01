import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Menu, BarChart3, Users, Settings, LogOut, ChevronDown, Search, ShoppingCart, AlertCircle, DollarSign, Ticket, FileText, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const API_URL = 'https://cafenova.onrender.com';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [cafes, setCafes] = useState([]);
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
            {/* Dashboard */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'overview'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={20} />
              {sidebarOpen && <span className="font-medium">Dashboard</span>}
            </button>

            {/* Live Order */}
            <button
              onClick={() => setActiveTab('live-order')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'live-order'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingCart size={20} />
              {sidebarOpen && <span className="font-medium">Live Order</span>}
            </button>

            {/* Order */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'orders'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText size={20} />
              {sidebarOpen && <span className="font-medium">Order</span>}
            </button>

            {sidebarOpen && (
              <>
                {/* Users Section */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">Users</p>
                  <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition text-sm">
                    <Users size={18} />
                    <span>Employees</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition text-sm">
                    <Users size={18} />
                    <span>Drivers</span>
                  </button>
                </div>

                {/* Admin Section */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">Admin</p>
                  
                  {/* Store */}
                  <button
                    onClick={() => setActiveTab('store')}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm ${
                      activeTab === 'store'
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <UtensilsCrossed size={18} />
                    <span>Store</span>
                  </button>

                  {/* Food Menu with submenu */}
                  <div>
                    <button
                      onClick={() => setActiveTab('menu')}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm ${
                        activeTab === 'menu'
                          ? 'bg-green-100 text-green-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Menu size={18} />
                      <span>Food Menu</span>
                    </button>
                    {activeTab === 'menu' && (
                      <div className="ml-8 space-y-1 mt-1">
                        <p className="text-xs text-gray-500 px-2 py-1 font-medium">Menu Items</p>
                        <p className="text-xs text-gray-500 px-2 py-1 font-medium">Additives</p>
                        <p className="text-xs text-gray-500 px-2 py-1 font-medium">Extras</p>
                        <p className="text-xs text-gray-500 px-2 py-1 font-medium">Variant</p>
                      </div>
                    )}
                  </div>

                  {/* Finance */}
                  <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition text-sm">
                    <DollarSign size={18} />
                    <span>Finance</span>
                  </button>

                  {/* Subscription */}
                  <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition text-sm">
                    <AlertCircle size={18} />
                    <span>Subscription</span>
                  </button>

                  {/* Coupon */}
                  <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition text-sm">
                    <Ticket size={18} />
                    <span>Coupon</span>
                  </button>

                  {/* Pages */}
                  <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition text-sm">
                    <FileText size={18} />
                    <span>Pages</span>
                  </button>
                </div>
              </>
            )}
          </nav>

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
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {vendorProfile?.vendor?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Section - Stats */}
                <div className="lg:col-span-2">
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

                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Vendor Profile</h2>
                    <div className="space-y-3 text-sm">
                      <p><span className="font-medium text-gray-600">Name:</span> {vendorProfile?.vendor?.name || 'N/A'}</p>
                      <p><span className="font-medium text-gray-600">Email:</span> {vendorProfile?.vendor?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Right Section - Cafes */}
                <div>
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cafes</h2>
                    <div className="space-y-4">
                      {cafes && cafes.length > 0 ? (
                        cafes.map((cafe) => (
                          <div 
                            key={cafe._id}
                            className="text-center cursor-pointer hover:opacity-80 transition"
                            onClick={() => navigate(`/vendors/cafe/${cafe._id}`)}
                          >
                            {/* Rounded First Image */}
                            <div className="mb-3 w-full h-40 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border-4 border-green-200 hover:border-green-400 transition">
                              {cafe.image ? (
                                <img 
                                  src={cafe.image} 
                                  alt={cafe.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-gray-400 text-center">
                                  <p className="text-sm">No Image</p>
                                </div>
                              )}
                            </div>
                            {/* Cafe Name */}
                            <p className="font-semibold text-gray-800">{cafe.name}</p>
                            <p className="text-xs text-gray-500">{cafe.city || 'City'}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No cafes registered yet</p>
                          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">
                            Register Cafe
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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

          {activeTab === 'store' && (
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Store</h1>
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-gray-600 text-lg">Store management features coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Settings</h1>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-gray-600">Settings coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
