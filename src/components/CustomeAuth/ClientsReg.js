import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient'; // Your supabase client import

const ClientRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async () => {
    const { fullName, email, phoneNumber, address, password } = formData;

    // Validate required fields
    let validationErrors = {};
    if (!fullName) validationErrors.fullName = 'Full Name is required';
    if (!email) validationErrors.email = 'Email is required';
    if (!phoneNumber) validationErrors.phoneNumber = 'Phone Number is required';
    if (!password) validationErrors.password = 'Password is required';

    // If any validation errors, show them and prevent submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill all required fields.');
      return;
    }

    try {
      // Check if the email already exists
      const { data: existingClient } = await supabase
        .from('clients_main_profiles')
        .select('email')
        .eq('email', email)
        .single(); // Check if the email is already registered

      if (existingClient) {
        toast.error('Email already exists. Please use a different email.');
        return;
      }

      // Hash the password using CryptoJS (SHA-256 in this case)
      const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);

      // Insert client's profile in the database
      const { error } = await supabase
        .from('clients_main_profiles')
        .insert([
          {
            full_name: fullName,
            email,
            phone_number: phoneNumber,
            address,  // Address is optional
            password: hashedPassword,
          },
        ]);

      if (error) {
        throw error;
      }

      toast.success('Client registered successfully!');
    } catch (error) {
      toast.error(`Error registering client: ${error.message}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-green-600 text-center">Client Registration</h2>
      
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
        placeholder="Address (Optional)"
        value={formData.address}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-md mb-4"
      />

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
        className="w-full bg-green-600 text-white py-3 rounded-md  font-semibold hover:bg-green-700"
      >
        Register as Client
      </button>
    </div>
  );
};

export default ClientRegistration;
