import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Star, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const API_URL = 'https://cafenova.onrender.com';

const VendorProfile = () => {
  const { cafeId } = useParams();
  const navigate = useNavigate();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const vendorToken = localStorage.getItem('vendorToken');
    if (vendorToken) {
      fetchCafeDetails(vendorToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cafeId]);

  const fetchCafeDetails = async (token) => {
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
        const cafes = data.data || data.cafes || [];
        const foundCafe = cafes.find((c) => c._id === cafeId);
        if (foundCafe) {
          setCafe(foundCafe);
        } else {
          setError('Cafe not found');
        }
      } else {
        setError('Failed to fetch cafe details');
      }
    } catch (err) {
      setError('Error fetching cafe details: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Loading cafe details...</p>
        </div>
      </div>
    );
  }

  if (error || !cafe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/vendors')}
            className="flex items-center gap-2 text-green-600 hover:text-green-800 mb-6 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <p className="text-gray-600 text-lg">{error || 'Cafe not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/vendors')}
          className="flex items-center gap-2 text-green-600 hover:text-green-800 mb-8 font-semibold transition-all"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Cafe Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cafe Image */}
          {cafe.image && (
            <div className="w-full h-96 overflow-hidden">
              <img
                src={cafe.image}
                alt={cafe.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Cafe Content */}
          <div className="p-8 md:p-12">
            {/* Cafe Name */}
            <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
              {cafe.name}
            </h1>

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {cafe.description || 'No description available'}
            </p>

            {/* Location Section */}
            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Location Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Address</p>
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-green-600 shrink-0 mt-1" />
                    <p className="text-gray-800 text-lg">
                      {cafe.address || cafe.location || 'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-2">City</p>
                  <p className="text-gray-800 text-lg">{cafe.city || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-2">State</p>
                  <p className="text-gray-800 text-lg">{cafe.state || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Pincode</p>
                  <p className="text-gray-800 text-lg">{cafe.pincode || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Coordinates Section */}
            <div className="bg-blue-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Coordinates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center gap-4">
                  <MapPin size={24} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Latitude</p>
                    <p className="text-gray-800 text-lg font-mono">
                      {cafe.latitude || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin size={24} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Longitude</p>
                    <p className="text-gray-800 text-lg font-mono">
                      {cafe.longitude || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;