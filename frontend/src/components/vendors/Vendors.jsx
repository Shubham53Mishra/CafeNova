import React, { useState } from 'react';
import { Star, MapPin, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar';

const Vendors = () => {
  const [selectedVendor, setSelectedVendor] = useState(null);

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
    </div>
  );
};

export default Vendors;
