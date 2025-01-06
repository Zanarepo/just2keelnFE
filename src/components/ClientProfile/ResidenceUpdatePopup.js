import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const ResidenceUpdatePopup = () => {
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // For state filtering
  const clientEmail = localStorage.getItem('client_email');

  const statesInNigeria = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
    'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
    'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
    'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ];

  useEffect(() => {
    const checkResidenceInfo = async () => {
      if (!clientEmail) {
        toast.error('Client email not found.');
        return;
      }

      const { data, error } = await supabase
        .from('clients_main_profiles')
        .select('state_of_residence, lga_of_residence')
        .eq('email', clientEmail)
        .single();

      if (error) {
        console.error('Error fetching residence info:', error.message);
        return;
      }

      if (!data.state_of_residence || !data.lga_of_residence) {
        setShowModal(true); // Show modal if info is missing
      }
    };

    checkResidenceInfo();
  }, [clientEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state || !lga) {
      toast.error('Please fill in all fields.');
      return;
    }

    const { error } = await supabase
      .from('clients_main_profiles')
      .update({ state_of_residence: state, lga_of_residence: lga })
      .eq('email', clientEmail);

    if (error) {
      console.error('Error updating residence info:', error.message);
      toast.error('Failed to update residence information.');
    } else {
      toast.success('Residence information updated successfully.');
      setShowModal(false); // Close modal on success
    }
  };

  const filteredStates = statesInNigeria.filter((st) =>
    st.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold text-green-600 mb-4 text-center">Update Residence Info</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="state" className="block text-gray-700 font-medium mb-2">
                  State of Residence
                </label>
                <input
                  type="text"
                  id="stateSearch"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded mb-2"
                  placeholder="Search for a state..."
                />
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Select your state</option>
                  {filteredStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="lga" className="block text-gray-700 font-medium mb-2">
                  LGA of Residence
                </label>
                <input
                  type="text"
                  id="lga"
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter your LGA"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ResidenceUpdatePopup;
