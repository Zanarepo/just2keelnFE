import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../../supabaseClient';
import { FaEdit, FaTrash, FaCopy, FaLock, FaUnlock } from 'react-icons/fa';

const CleaningSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [formData, setFormData] = useState({
    building_type: '',
    num_rooms: '',
    price: '',
    discount: '',
    description: '',
    frequency_id: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [basePricePerRoom, setBasePricePerRoom] = useState(0);
  const [baseDiscount, setBaseDiscount] = useState(0);
  const [autoUpdateLocked, setAutoUpdateLocked] = useState(false);
  const [baseDiscountLocked, setBaseDiscountLocked] = useState(false);
  const [selectedBuildingTypes, setSelectedBuildingTypes] = useState([]);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase.from('cleaning_subscriptions').select('*');
      if (error) throw error;
      setSubscriptions(data);
    } catch (error) {
      toast.error('Failed to retrieve subscriptions');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBuildingTypeSelection = (e) => {
    const { value, checked } = e.target;
    setSelectedBuildingTypes((prev) =>
      checked ? [...prev, value] : prev.filter((type) => type !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, ...dataToInsert } = formData; // Exclude 'id' from the data to insert

    try {
      let response;
      if (isEditing) {
        response = await supabase
          .from('cleaning_subscriptions')
          .update(dataToInsert)
          .eq('id', editingId);
        if (response.error) throw response.error;
        toast.success('Subscription updated successfully');
      } else {
        response = await supabase.from('cleaning_subscriptions').insert([dataToInsert]);
        if (response.error) throw response.error;
        toast.success('Subscription added successfully');
      }

      setFormData({
        building_type: '',
        num_rooms: '',
        price: '',
        discount: '',
        description: '',
        frequency_id: ''
      });
      setIsEditing(false);
      fetchSubscriptions();
    } catch (error) {
      toast.error('Failed to save subscription');
    }
  };

  const handleEdit = (subscription) => {
    setFormData({
      building_type: subscription.building_type,
      num_rooms: subscription.num_rooms,
      price: subscription.price,
      discount: subscription.discount,
      description: subscription.description,
      frequency_id: subscription.frequency_id
    });
    setIsEditing(true);
    setEditingId(subscription.id);
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('cleaning_subscriptions').delete().eq('id', id);
      if (error) throw error;
      toast.success('Subscription deleted successfully');
      fetchSubscriptions();
    } catch (error) {
      toast.error('Failed to delete subscription');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const { data: subscription, error } = await supabase
        .from('cleaning_subscriptions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      const { id: _, created_at, ...duplicatedData } = subscription;

      const {  error: insertError } = await supabase
        .from('cleaning_subscriptions')
        .insert([duplicatedData]);

      if (insertError) {
        throw insertError;
      }

      toast.success('Subscription duplicated successfully');
      fetchSubscriptions();
    } catch (error) {
      toast.error('Failed to duplicate subscription');
    }
  };

  const handleAutoUpdate = async () => {
    try {
      const updatedSubscriptions = subscriptions.map((sub) => {
        if (
          autoUpdateLocked ||
          (selectedBuildingTypes.length > 0 && !selectedBuildingTypes.includes(sub.building_type))
        ) {
          return sub;
        }

        const updatedPrice = sub.num_rooms * basePricePerRoom;
        const priceWithBaseDiscount = updatedPrice - updatedPrice * (baseDiscount / 100);
        const updatedDiscountedPrice = priceWithBaseDiscount - priceWithBaseDiscount * (sub.discount / 100);

        return { ...sub, price: updatedDiscountedPrice };
      });

      const { error } = await supabase.from('cleaning_subscriptions').upsert(updatedSubscriptions);
      if (error) throw error;

      toast.success('Subscriptions auto-updated successfully');
      fetchSubscriptions();
    } catch (error) {
      toast.error('Failed to auto-update subscriptions');
    }
  };

  const toggleAutoUpdateLock = () => {
    setAutoUpdateLocked(!autoUpdateLocked);
    toast.info(autoUpdateLocked ? 'Auto Update Unlocked' : 'Auto Update Locked');
  };

  const toggleBaseDiscountLock = () => {
    setBaseDiscountLocked(!baseDiscountLocked);
    toast.info(baseDiscountLocked ? 'Base Discount Unlocked' : 'Base Discount Locked');
  };

  const uniqueBuildingTypes = [...new Set(subscriptions.map((sub) => sub.building_type))];
  return (
    <div className="p-6">
      <h1 className="text-lg sm:text-xl font-bold text-center text-green-600 p-6">Cleaning Subscriptions</h1>
  
      {/* Base Price and Discount Input */}
      <div className="mb-4">
        <label className="block text-green-700">Base Price per Room:</label>
        <input
          type="number"
          value={basePricePerRoom}
          onChange={(e) => setBasePricePerRoom(parseFloat(e.target.value) || 0)}
          className="p-2 border rounded w-full"
        />
  
        <label className="block text-green-700 mt-4">Base Discount (%)</label>
        <input
          type="number"
          value={baseDiscount}
          onChange={(e) => setBaseDiscount(parseFloat(e.target.value) || 0)}
          disabled={baseDiscountLocked}
          className="p-2 border rounded w-full"
        />
  
        {/* Building Type Selection */}
        <div className="my-4">
          <label className="block text-green-700 mb-2">Select Building Types for Auto Update:</label>
          {uniqueBuildingTypes.map((buildingType) => (
            <div key={buildingType}>
              <label>
                <input
                  type="checkbox"
                  value={buildingType}
                  onChange={handleBuildingTypeSelection}
                  checked={selectedBuildingTypes.includes(buildingType)}
                  className="mr-2"
                />
                {buildingType}
              </label>
            </div>
          ))}
        </div>
  
        {/* Buttons for Auto Update and Lock Toggles */}
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <button
            onClick={handleAutoUpdate}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Auto Update
          </button>
          <button
            onClick={toggleAutoUpdateLock}
            className={`px-4 py-2 ${
              autoUpdateLocked ? 'bg-red-500' : 'bg-green-600'
            } text-white rounded`}
          >
            {autoUpdateLocked ? <FaUnlock /> : <FaLock />}
          </button>
          <button
            onClick={toggleBaseDiscountLock}
            className={`px-4 py-2 ${
              baseDiscountLocked ? 'bg-red-500' : 'bg-green-600'
            } text-white rounded`}
          >
            {baseDiscountLocked ? <FaUnlock /> : <FaLock />}
          </button>
        </div>
      </div>
  
      {/* Form for Adding/Updating Subscriptions */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="building_type"
            value={formData.building_type}
            onChange={handleInputChange}
            placeholder="Building Type"
            className="p-2 border rounded w-full"
            required
          />
          <input
            type="number"
            name="num_rooms"
            value={formData.num_rooms}
            onChange={handleInputChange}
            placeholder="Number of Rooms"
            className="p-2 border rounded w-full"
            required
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="p-2 border rounded w-full"
            required
          />
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            placeholder="Discount"
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="p-2 border rounded w-full"
            required
          />
          <input
            type="text"
            name="frequency_id"
            value={formData.frequency_id}
            onChange={handleInputChange}
            placeholder="Frequency ID"
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded w-full sm:w-auto"
        >
          {isEditing ? 'Update' : 'Add'} Subscription
        </button>
      </form>
      <div className="overflow-x-auto">
  <table className="table-auto w-full border-collapse border border-gray-300 text-sm sm:text-base">
    <thead>
      <tr className="bg-green-200 text-xs sm:text-sm text-gray-600 border border-gray-300">
        <th className="border p-2">Building Type</th>
        <th className="border p-2">Number of Rooms</th>
        <th className="border p-2">Price</th>
        <th className="border p-2">Discount</th>
        <th className="border p-2">Description</th>
        <th className="border p-2">Frequency ID</th>
        <th className="border p-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {subscriptions.map((sub, index) => (
        <tr
          key={sub.id}
          className={`${
            index % 2 === 0 ? "bg-gray-100" : "bg-white"
          } text-gray-700`}
        >
          <td className="border p-2">{sub.building_type}</td>
          <td className="border p-2">{sub.num_rooms}</td>
          <td className="border p-2">{sub.price}</td>
          <td className="border p-2">{sub.discount}</td>
          <td className="border p-2">{sub.description}</td>
          <td className="border p-2">{sub.frequency_id}</td>
          <td className="border p-2">
            <button
              onClick={() => handleEdit(sub)}
              className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(sub.id)}
              className="px-2 py-1 bg-red-500 text-white rounded mr-2"
            >
              <FaTrash />
            </button>
            <button
              onClick={() => handleDuplicate(sub.id)}
              className="px-2 py-1 bg-blue-500 text-white rounded"
            >
              <FaCopy />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
  
  
};

export default CleaningSubscriptions;
