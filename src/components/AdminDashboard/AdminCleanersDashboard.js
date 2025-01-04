import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminCleanersDashboard = () => {
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false); // For confirmation modal
  const [selectedCleanerId, setSelectedCleanerId] = useState(null);
  const [action, setAction] = useState('');
  const [selectedCleanerName, setSelectedCleanerName] = useState('');

  // Fetch cleaner data from the database
  const fetchCleanersData = async () => {
    try {
      const { data, error } = await supabase
        .from('cleaners_main_profiles')
        .select('id, full_name, email, phone_number, years_of_experience, specialization, profile_picture_url, status');
      
      if (error) throw error;

      setCleaners(data);
    } catch (error) {
      toast.error('Error fetching cleaners data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle actions like suspend, activate, or delete
  const handleAction = (cleanerId, action, cleanerName) => {
    setSelectedCleanerId(cleanerId);
    setAction(action);
    setSelectedCleanerName(cleanerName);
    setShowConfirmation(true); // Show confirmation modal
  };

  const performAction = async () => {
    try {
      let updateData = {};
      let successMessage = '';
      
      switch (action) {
        case 'suspend':
          updateData = { status: 'suspended' };
          successMessage = 'Cleaner suspended successfully!';
          break;
        case 'activate':
          updateData = { status: 'active' };
          successMessage = 'Cleaner activated successfully!';
          break;
        case 'delete':
          // Deleting the cleaner profile
          const { error: deleteError } = await supabase
            .from('cleaners_main_profiles')
            .delete()
            .eq('id', selectedCleanerId);

          if (deleteError) throw deleteError;
          toast.success('Cleaner deleted successfully!');
          setCleaners(cleaners.filter(cleaner => cleaner.id !== selectedCleanerId));
          setShowConfirmation(false); // Close the confirmation after delete
          return; // Exit after delete
        default:
          return;
      }

      // Update the status in the database
      const { error } = await supabase
        .from('cleaners_main_profiles')
        .update(updateData)
        .eq('id', selectedCleanerId);

      if (error) throw error;

      setCleaners(
        cleaners.map(cleaner =>
          cleaner.id === selectedCleanerId ? { ...cleaner, status: updateData.status } : cleaner
        )
      );
      toast.success(successMessage);
      setShowConfirmation(false); // Close the confirmation modal
    } catch (error) {
      toast.error(`Error performing ${action} on cleaner`);
      console.error(error);
      setShowConfirmation(false); // Close the modal on error
    }
  };

  // Run fetch on component mount
  useEffect(() => {
    fetchCleanersData();
  }, []);

  // Handle modal cancel
  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="p-6 bg-white-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-semibold text-green-500 mb-4 text-center">
  Cleaners Dashboard
</h1>


      {/* Loading State */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          {/* Table to Display Cleaners */}
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="text-left border-b">
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone Number</th>
                <th className="px-4 py-2">Years of Experience</th>
                <th className="px-4 py-2">Specialization</th>
                <th className="px-4 py-2">Status</th> {/* Status column added */}
                <th className="px-4 py-2">Profile Picture</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Render Each Cleaner */}
              {cleaners.map(cleaner => (
                <tr key={cleaner.id} className="border-b">
                  <td className="px-4 py-2">{cleaner.full_name}</td>
                  <td className="px-4 py-2">{cleaner.email}</td>
                  <td className="px-4 py-2">{cleaner.phone_number}</td>
                  <td className="px-4 py-2">{cleaner.years_of_experience}</td>
                  <td className="px-4 py-2">{cleaner.specialization}</td>
                  <td className="px-4 py-2">{cleaner.status}</td> {/* Display status */}
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center">
                      <img
                        src={cleaner.profile_picture_url}
                        alt={cleaner.full_name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      onChange={(e) => handleAction(cleaner.id, e.target.value, cleaner.full_name)}
                      className="px-4 py-2 border rounded-md focus:outline-none"
                    >
                      <option value="">Select Action</option>
                      <option value="suspend">Suspend</option>
                      <option value="activate">Activate</option>
                      <option value="delete">Delete</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inline Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Are you sure you want to {action} {selectedCleanerName}?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={performAction}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCleanersDashboard;
