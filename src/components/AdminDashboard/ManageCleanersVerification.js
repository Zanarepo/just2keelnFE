import React, { useEffect, useState } from 'react'; 
import { supabase } from '../../supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageCleanersVerification = () => {
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch cleaner data for verification
  const fetchCleanersData = async () => {
    try {
      const { data, error } = await supabase
        .from('cleaners_main_profiles')
        .select('id, full_name, government_id_url, address_picture_url, profile_verified');
      
      if (error) throw error;

      setCleaners(data);
    } catch (error) {
      toast.error('Error fetching cleaners data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Generate public URL for a file
  const getPublicFileUrl = (filePath) => {
    const supabaseUrl = 'https://xgkvvxdgxwitugsockeu.supabase.co';  // Your Supabase URL
    const bucketName = 'file storage';  // Your bucket name
    return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
  };

  // Handle opening of the modal with file
  const openFileInModal = (filePath) => {
    try {
      const fileUrl = getPublicFileUrl(filePath);
      setSelectedFileUrl(fileUrl);
      setModalOpen(true);
    } catch (error) {
      setError('Error retrieving the file.');
      console.error(error);
    }
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedFileUrl(null);
    setError(null);
  };

  // Handle verification action
  const handleVerification = async (cleanerId, status) => {
    try {
      const isVerified = status === 'Verified' ? true : false;

      const { error } = await supabase
        .from('cleaners_main_profiles')
        .update({ profile_verified: isVerified })
        .eq('id', cleanerId);
      
      if (error) throw error;

      toast.success(`Cleaner ${status} successfully!`);
      fetchCleanersData(); // Re-fetch data to update UI
    } catch (error) {
      toast.error('Error updating verification status');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCleanersData();
  }, []);

  return (
    <div className="p-6 bg-white-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-semibold text-green-500 mb-4 text-center">Manage Cleaners Verification</h1>

      {/* Loading State */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          {/* Table to Display Cleaners */}
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="text-left border-b">
                <th className="px-4 py-2">Cleaner Name</th>
                <th className="px-4 py-2">Government ID</th>
                <th className="px-4 py-2">Address Picture</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Render Each Cleaner */}
              {cleaners.map(cleaner => (
                <tr key={cleaner.id}>
                  <td className="px-4 py-2">{cleaner.full_name}</td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => openFileInModal(cleaner.government_id_url)} // Open in modal
                      className="text-blue-500 hover:underline"
                    >
                      View Document
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => openFileInModal(cleaner.address_picture_url)} // Open in modal
                      className="text-blue-500 hover:underline"
                    >
                      View Document
                    </button>
                  </td>
                  <td className="px-4 py-2">{cleaner.profile_verified ? 'Verified' : 'Pending'}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleVerification(cleaner.id, cleaner.profile_verified ? 'Rejected' : 'Verified')}
                      className={`px-4 py-2 rounded-md ${cleaner.profile_verified ? 'bg-red-500' : 'bg-green-500'} text-white`}
                    >
                      {cleaner.profile_verified ? 'Reject' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

     {/* Modal for Viewing Files */}
{/* Modal for Viewing Files */}
{modalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Document Viewer</h2>
        <button onClick={closeModal} className="text-xl font-bold">&times;</button>
      </div>

      {error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="flex justify-center items-center">
          <img
            src={selectedFileUrl}
            alt="Document"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  </div>
)}


      
    </div>
  );
};

export default ManageCleanersVerification;
