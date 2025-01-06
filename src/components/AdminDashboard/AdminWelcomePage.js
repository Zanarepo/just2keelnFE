import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify'; // Ensure proper import
import 'react-toastify/dist/ReactToastify.css'; // Import styles

const AdminWelcomePage = () => {
  const [greeting, setGreeting] = useState(''); // State for greeting
  const [message, setMessage] = useState(''); // State for the message

  useEffect(() => {
    // Set greeting and message once when the component mounts
    const initialGreeting = getGreeting();
    setGreeting(initialGreeting);  // Set the initial greeting
    setMessage(getRandomMessage());  // Set the initial message
    
    // Display greeting message using toast
    toast.info(`${initialGreeting}, Admin!`, {
      position: "top-center",  // Correct position string
      autoClose: 3000,
    });
  }, []); // Empty dependency array, runs only once

  // Function to determine the greeting based on the time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Function to get a random message
  const getRandomMessage = () => {
    const messages = [
      'We’re thrilled to have you back. Here’s to another day of making great things happen!',
      'Let’s make today productive and impactful as you continue leading our platform to success!',
      'Here’s to another day of shaping the future with your leadership. Keep up the great work!',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-6 bg-white shadow-xl rounded-lg max-w-lg w-full">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">
          {greeting}, Admin!
        </h1>
        <p className="text-lg text-gray-600 mb-4">{message}</p>
        <p className="mt-6 text-gray-500 italic">
          &ldquo;Leadership is not about being in charge. It’s about taking care of those in your charge.&rdquo;
        </p>
      </div>

      {/* ToastContainer to display the toast message */}
      <ToastContainer />
    </div>
  );
};

export default AdminWelcomePage;
