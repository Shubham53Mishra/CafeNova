import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import VendorLogin from './components/vendors/Login';
import VendorSignup from './components/vendors/Signup';
import Vendors from './components/vendors/Vendors';
import VendorProfile from './components/vendors/VendorProfile';
import VendorDashboard from './components/vendors/VendorDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Vendor Routes */}
        <Route path="/vendors/login" element={<VendorLogin />} />
        <Route path="/vendors/signup" element={<VendorSignup />} />
        <Route path="/vendors/dashboard" element={<VendorDashboard />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/vendors/cafe/:cafeId" element={<VendorProfile />} />
        
        {/* Home Route */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Your content will go here */}
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
