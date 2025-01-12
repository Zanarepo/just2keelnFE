import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles
import { supabase } from '../../supabaseClient'; // Your supabase client import

const CleanerRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isRegistering, setIsRegistering] = useState(false); // To manage loading state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async () => {
    const { fullName, email, phoneNumber, address, password } = formData;

    // Validation
    let validationErrors = {};
    if (!fullName) validationErrors.fullName = 'Full Name is required';
    if (!email) validationErrors.email = 'Email is required';
    if (!phoneNumber) validationErrors.phoneNumber = 'Phone Number is required';
    if (!address) validationErrors.address = 'Address is required';
    if (!password) validationErrors.password = 'Password is required';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill all required fields.'); // Trigger error toast
      return;
    }

    setIsRegistering(true); // Start the registration process

    try {
      // Hash the password using CryptoJS (SHA-256 in this case)
      const hashedPassword = CryptoJS.SHA256(password).toString(); // Hex encoding




      // Insert cleaner's profile in the database
      const { error } = await supabase
        .from('cleaners_main_profiles')
        .insert([
          {
            full_name: fullName,
            email,
            phone_number: phoneNumber,
            address,
            password: hashedPassword,
          },
        ]);

      if (error) {
        throw error;
      }

      toast.success('Cleaner registered successfully!'); // Trigger success toast

      // Display delayed email verification message after 3 seconds
      setTimeout(() => {
        toast.info('Please check your email for a confirmation link.');
      }, 3000); // 3-second delay
    } catch (error) {
      toast.error(`Error registering cleaner: ${error.message}`); // Trigger error toast if there's an issue
    } finally {
      setIsRegistering(false); // End the registration process
    }
  };












  
  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-green-500 mb-4 text-center">Cleaner Registration</h2>
      
      {/* Full Name */}
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleInputChange}
        className={`w-full p-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md mb-4`}
      />
      {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md mb-4`}
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      {/* Phone Number */}
      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleInputChange}
        className={`w-full p-3 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md mb-4`}
      />
      {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}

      {/* Address */}
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleInputChange}
        className={`w-full p-3 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md mb-4`}
      />
      {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

      {/* Password */}
      <div className="relative mb-4">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

      <button
        onClick={handleRegister}
        className="w-full bg-green-500 text-white py-3  mb-4 text-center rounded-md font-semibold hover:bg-green-600"
        disabled={isRegistering} // Disable button while registering
      >
        {isRegistering ? 'Registering...' : 'Register as Cleaner'}
      </button>

      {/* Toast Container */}
      <ToastContainer /> {/* Make sure to include ToastContainer to display toasts */}
    </div>
  );
};

export default CleanerRegistration;
