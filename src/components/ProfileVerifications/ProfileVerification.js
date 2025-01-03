import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ProfileVerification = () => {
  const [idType, setIdType] = useState('');
  const [governmentIdFile, setGovernmentIdFile] = useState(null);
  const [addressFile, setAddressFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate
  const email = localStorage.getItem('email');

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const uploadFile = async (file, filePath) => {
    const { data, error } = await supabase.storage
      .from('file storage')
      .upload(filePath, file);

    if (error) {
      throw new Error('File upload failed');
    }

    return data.path;
  };

  const handleSubmit = async () => {
    if (!email) {
      toast.error('User email not found. Please log in again.');
      return;
    }

    if (!idType) {
      toast.error('Please select a valid ID type.');
      return;
    }

    if (!governmentIdFile || !addressFile) {
      toast.error('Please upload both government ID and address verification files.');
      return;
    }

    try {
      setIsLoading(true);

      // Upload government ID file
      const governmentIdPath = `government_ids/${email}-${Date.now()}`;
      const governmentIdUrl = await uploadFile(governmentIdFile, governmentIdPath);

      // Upload address verification file
      const addressPath = `address_verification/${email}-${Date.now()}`;
      const addressUrl = await uploadFile(addressFile, addressPath);

      // Update the database with the uploaded file URLs
      const { error } = await supabase
        .from('cleaners_main_profiles')
        .update({
          government_id_url: governmentIdUrl,
          address_picture_url: addressUrl,
        })
        .eq('email', email);

      if (error) {
        throw error;
      }

      toast.success('Profile verification details submitted successfully.');
    } catch (error) {
      console.error('Error submitting verification details:', error);
      toast.error('Failed to submit profile verification details.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white min-h-screen p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-center text-green-500">
          Profile Verification
        </h2>
  
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select ID Type
          </label>
          <select
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="">-- Select ID Type --</option>
            <option value="Driver&#39;s License">Driver&#39;s License</option>
            <option value="NIN">NIN</option>
            <option value="Voter&#39;s Card">Voter&#39;s Card</option>
            <option value="International Passport">International Passport</option>
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Government ID
          </label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setGovernmentIdFile)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Address Verification Document
          </label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setAddressFile)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
  
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`bg-green-500 text-white py-2 px-4 rounded-lg w-full ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Submitting...' : 'Submit Verification'}
        </button>
  
        {/* Back to Profile Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/profile')}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg w-full hover:bg-gray-600"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default ProfileVerification;
