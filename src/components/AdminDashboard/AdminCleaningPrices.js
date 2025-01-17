import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Supabase client setup
import { toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import styles

const AdminCleaningPrices = () => {
  const [prices, setPrices] = useState([]);
  const [formData, setFormData] = useState({
    building_type: '',
    building_condition: '',
    num_rooms: '',
    base_price: '',
    description: '',
    discount_percentage: '',
    service_category: '',
  });
  const [searchFilters, setSearchFilters] = useState({
    building_type: '',
    building_condition: '',
    num_rooms: '',
    service_category: '',
  });
  const [editingId, setEditingId] = useState(null); // Track which record is being edited

  useEffect(() => {
    const fetchPrices = async () => {
      const { data, error } = await supabase.from('cleaning_prices').select('*');
      if (error) {
        toast.error('Error fetching data');
      } else {
        setPrices(data);
      }
    };
    fetchPrices();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
  };

  const filteredPrices = prices.filter((price) => {
    return (
      (searchFilters.building_type === '' || price.building_type.includes(searchFilters.building_type)) &&
      (searchFilters.building_condition === '' || price.building_condition.includes(searchFilters.building_condition)) &&
      (searchFilters.num_rooms === '' || price.num_rooms.toString().includes(searchFilters.num_rooms)) &&
      (searchFilters.service_category === '' || price.service_category.includes(searchFilters.service_category))
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from('cleaning_prices')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', editingId);

      if (error) {
        toast.error('Error updating price');
      } else {
        setPrices((prevPrices) =>
          prevPrices.map((price) =>
            price.id === editingId ? { ...price, ...formData } : price
          )
        );
        setEditingId(null);
        resetForm();
        toast.success('Price updated successfully');
      }
    } else {
      const { error } = await supabase.from('cleaning_prices').insert([formData]);

      if (error) {
        toast.error('Error adding price');
      } else {
        setPrices([...prices, { ...formData, id: prices.length + 1 }]);
        resetForm();
        toast.success('Price added successfully');
      }
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('cleaning_prices').delete().eq('id', id);
    if (error) {
      toast.error('Error deleting price');
    } else {
      setPrices(prices.filter((price) => price.id !== id));
      toast.success('Price deleted successfully');
    }
  };

  const handleEdit = (price) => {
    setEditingId(price.id);
    setFormData({ ...price });
  };

  const resetForm = () => {
    setFormData({
      building_type: '',
      building_condition: '',
      num_rooms: '',
      base_price: '',
      description: '',
      discount_percentage: '',
      service_category: '',
    });
  };

  return (
    <div className="admin-cleaning-prices">
      <h2 className="text-3xl font-bold text-center text-green-500 mb-8">Manage Cleaning Prices</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="building_type"
            value={formData.building_type}
            onChange={handleInputChange}
            placeholder="Building Type"
            className="p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            name="building_condition"
            value={formData.building_condition}
            onChange={handleInputChange}
            placeholder="Building Condition"
            className="p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="number"
            name="num_rooms"
            value={formData.num_rooms}
            onChange={handleInputChange}
            placeholder="Number of Rooms"
            className="p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="number"
            name="base_price"
            value={formData.base_price}
            onChange={handleInputChange}
            placeholder="Base Price"
            className="p-2 border border-gray-300 rounded-md"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            name="discount_percentage"
            value={formData.discount_percentage}
            onChange={handleInputChange}
            placeholder="Discount Percentage"
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="service_category"
            value={formData.service_category}
            onChange={handleInputChange}
            placeholder="Service Category"
            className="p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button type="submit" className="mt-4 bg-green-600 text-white px-8 py-3 rounded-lg">
          {editingId ? 'Update Price' : 'Add Price'}
        </button>
      </form>

      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-center text-green-600 p-6">Search Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            name="building_type"
            value={searchFilters.building_type}
            onChange={handleFilterChange}
            placeholder="Filter by Building Type"
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="building_condition"
            value={searchFilters.building_condition}
            onChange={handleFilterChange}
            placeholder="Filter by Building Condition"
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            name="num_rooms"
            value={searchFilters.num_rooms}
            onChange={handleFilterChange}
            placeholder="Filter by Number of Rooms"
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="service_category"
            value={searchFilters.service_category}
            onChange={handleFilterChange}
            placeholder="Filter by Service Category"
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
    <table className="w-full border-collapse text-center">
      <thead>
        <tr className="bg-green-200 text-xs sm:text-sm text-gray-600">
          <th className="border-b p-2">ID</th>
          <th className="border-b p-2">Building Type</th>
          <th className="border-b p-2">Condition</th>
          <th className="border-b p-2">Rooms</th>
          <th className="border-b p-2">Price (₦)</th>
          <th className="border-b p-2">Discount (%)</th>
          <th className="border-b p-2">Actions</th>
        </tr>
      </thead>

          <tbody>
            {filteredPrices.map((price) => (
              <tr key={price.id}>
                <td className="border-b p-2">{price.id}</td>
                <td className="border-b p-2">{price.building_type}</td>
                <td className="border-b p-2">{price.building_condition}</td>
                <td className="border-b p-2">{price.num_rooms}</td>
                <td className="border-b p-2">₦{price.base_price}</td>
                <td className="border-b p-2">{price.discount_percentage}%</td>
                <td className="border-b p-2 flex justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(price)}
                    className="text-green-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(price.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCleaningPrices;
