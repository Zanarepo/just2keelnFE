import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const ClientCleanerMatch = () => {
  const [clients, setClients] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCleaner, setSelectedCleaner] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceTime, setServiceTime] = useState('');
  const [status] = useState('pending');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCleanerProfile, setSelectedCleanerProfile] = useState(null);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchCleaners();
    fetchSchedules();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase.from('clients_main_profiles').select('id, full_name');
    if (error) {
      toast.error('Error fetching clients');
    } else {
      setClients(data);
    }
  };

  const fetchCleaners = async () => {
    const { data, error } = await supabase.from('cleaners_main_profiles').select('id, full_name');
    if (error) {
      toast.error('Error fetching cleaners');
    } else {
      setCleaners(data);
    }
  };

  const fetchSchedules = async () => {
    const { data, error } = await supabase
      .from('client_schedules')
      .select('id, service_type, service_date, service_time, status, client_id, cleaner_id')
      .order('service_date', { ascending: false });

    if (error) {
      toast.error('Error fetching schedules');
    } else {
      setSchedules(data);
    }
  };

  const handleAddSchedule = async () => {
    const { error } = await supabase
      .from('client_schedules')
      .insert([{
        client_id: selectedClient,
        cleaner_id: selectedCleaner,
        service_type: serviceType,
        service_date: serviceDate,
        service_time: serviceTime,
        status: status,
      }]);

    if (error) {
      toast.error('Error adding schedule');
    } else {
      toast.success('Schedule added successfully');
      fetchSchedules();
      setServiceType('');
      setServiceDate('');
      setServiceTime('');
      setSelectedClient(null);
      setSelectedCleaner(null);
      setShowAddScheduleModal(false);
    }
  };

  const handleViewCleanerProfile = async (cleanerId) => {
    const { data, error } = await supabase
      .from('cleaners_main_profiles')
      .select('id, full_name, phone_number, address, years_of_experience, specialization, availability, profile_picture_url, service_locations, bio,  states_of_residence')
      .eq('id', cleanerId)
      .single();

    if (error) {
      toast.error('Error fetching cleaner profile');
    } else {
      setSelectedCleanerProfile(data);
      setModalVisible(true);
    }
  };

  const getClientNameById = (clientId) => {
    const client = clients.find(client => client.id === clientId);
    return client ? client.full_name : 'Unknown Client';
  };

  const getCleanerNameById = (cleanerId) => {
    const cleaner = cleaners.find(cleaner => cleaner.id === cleanerId);
    return cleaner ? cleaner.full_name : 'Unknown Cleaner';
  };

  return (
    <div className="min-h-screen bg-white-100 py-6 px-4">
      {/* Add Schedule Modal Button */}
      <button
        onClick={() => setShowAddScheduleModal(true)}
        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
      >
        Add Schedule
      </button>
  
      {/* Add Schedule Modal */}
      {showAddScheduleModal && (
        <div
          className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setShowAddScheduleModal(false)}
        >
          <div
            className="modal-content bg-white p-6 rounded-md w-full max-w-lg sm:max-w-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl  font-semibold mb-4 text-center">Add Schedule</h3>
  
            <div className="mb-4">
              <label htmlFor="client" className="block text-lg font-medium">Client</label>
              <select
                id="client"
                value={selectedClient || ''}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="mt-2 p-2 border rounded w-full"
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.full_name}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="mb-4">
              <label htmlFor="cleaner" className="block text-lg font-medium">Cleaner</label>
              <select
                id="cleaner"
                value={selectedCleaner || ''}
                onChange={(e) => setSelectedCleaner(e.target.value)}
                className="mt-2 p-2 border rounded w-full"
              >
                <option value="">Select Cleaner</option>
                {cleaners.map((cleaner) => (
                  <option key={cleaner.id} value={cleaner.id}>
                    {cleaner.full_name}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="mb-4">
              <label htmlFor="service-type" className="block text-lg font-medium">Service Type</label>
              <select
                id="service-type"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="mt-2 p-2 border rounded w-full"
              >
                <option value="">Select Service Type</option>
                <option value="Monthly Cleaning">Monthly Cleaning</option>
                <option value="Weekly Cleaning">Weekly Cleaning</option>
                <option value="Daily Cleaning">Daily Cleaning</option>
                <option value="Monthly Fumigation">Monthly Fumigation</option>
                <option value="Bi-weekly Cleaning">Bi-weekly Cleaning</option>
              </select>
            </div>
  
            <div className="mb-4">
              <label htmlFor="service-date" className="block text-lg font-medium">Service Date</label>
              <input
                type="date"
                id="service-date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="mt-2 p-2 border rounded w-full"
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="service-time" className="block text-lg font-medium">Service Time</label>
              <input
                type="time"
                id="service-time"
                value={serviceTime}
                onChange={(e) => setServiceTime(e.target.value)}
                className="mt-2 p-2 border rounded w-full"
              />
            </div>
  
            <div className="flex justify-between gap-4">
              <button
                onClick={handleAddSchedule}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 w-full sm:w-auto"
              >
                Add Schedule   
              </button>
              <button
                onClick={() => setShowAddScheduleModal(false)}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Schedules Table */}
      <div className="mb-8">
        <h3 className="text-xl  text-green-500 mb-4 text-center font-semibold mb-4">Scheduled Services</h3>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4">Client</th>
              <th className="py-2 px-4">Cleaner</th>
              <th className="py-2 px-4">Service Type</th>
              <th className="py-2 px-4">Service Date</th>
              <th className="py-2 px-4">Service Time</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Profiles</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">No schedules found.</td>
              </tr>
            ) : (
              schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="py-2 px-4">{getClientNameById(schedule.client_id)}</td>
                  <td className="py-2 px-4">{getCleanerNameById(schedule.cleaner_id)}</td>
                  <td className="py-2 px-4">{schedule.service_type}</td>
                  <td className="py-2 px-4">{schedule.service_date}</td>
                  <td className="py-2 px-4">{schedule.service_time}</td>
                  <td className="py-2 px-4">{schedule.status}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleViewCleanerProfile(schedule.cleaner_id)}
                      className="text-green-500 hover:underline"
                    >
                      View  Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
  
     {/* View Cleaner Profile Modal */}
{modalVisible && selectedCleanerProfile && (
  <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setModalVisible(false)}>
    <div className="modal-content bg-white p-6 rounded-md w-full sm:max-w-lg flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
      
      {/* Profile Content */}
      <div className="text-center mb-4">
        <img
          src={selectedCleanerProfile.profile_picture_url}
          alt={selectedCleanerProfile.full_name}
          className="rounded-full w-32 h-32 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold mb-4">{selectedCleanerProfile.full_name}</h3>
        <p><strong>Bio:</strong> {selectedCleanerProfile.bio}</p>
        <p><strong>Address:</strong> {selectedCleanerProfile.address}</p>
        <p><strong>Phone:</strong> {selectedCleanerProfile.phone_number}</p>
        <p><strong>Location:</strong> {selectedCleanerProfile.service_locations}</p>
        <p><strong>Residence:</strong> {selectedCleanerProfile.states_of_residence}</p>
        
      </div>

      {/* Close Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setModalVisible(false)}
          className="mt-4 bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 w-full sm:w-1/3"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      
    </div>
  );
  



  
};

export default ClientCleanerMatch;
