import React, { useState } from "react";
import { supabase } from "../../supabaseClient"; // Import Supabase client

const RegistrationForm = () => {
  const [userInfo, setUserInfo] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    profile_picture: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Create user via Supabase Auth
    const { email, password, full_name, phone_number, profile_picture } = userInfo;

    try {
      // Step 1: Sign up the user with email and password
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      // Step 2: If sign-up is successful, insert user information into the 'users' table
      const { error: insertError } = await supabase.from("users").insert([
        {
          email,
          full_name,
          phone_number,
          profile_picture,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      alert("Registration successful! Please check your email to verify your account.");
    } catch (err) {
      setError(err.message || "Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto my-8">
      <h2 className="text-2xl font-bold text-center mb-6">Register Your Account</h2>
      
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            value={userInfo.full_name}
            onChange={(e) => setUserInfo({ ...userInfo, full_name: e.target.value })}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            id="phone_number"
            value={userInfo.phone_number}
            onChange={(e) => setUserInfo({ ...userInfo, phone_number: e.target.value })}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={userInfo.password}
            onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Profile Picture URL */}
        <div>
          <label htmlFor="profile_picture" className="block text-sm font-semibold text-gray-700">
            Profile Picture URL (optional)
          </label>
          <input
            type="text"
            id="profile_picture"
            value={userInfo.profile_picture}
            onChange={(e) => setUserInfo({ ...userInfo, profile_picture: e.target.value })}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3 mt-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </section>
  );
};

export default RegistrationForm;
