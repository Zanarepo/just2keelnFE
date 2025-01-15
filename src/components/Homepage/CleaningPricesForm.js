import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Ensure supabaseClient is correctly imported
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles

const CleaningPriceComponent = () => {
  const [buildingType, setBuildingType] = useState('');
  const [buildingCondition, setBuildingCondition] = useState('');
  const [numRooms, setNumRooms] = useState('');
  const [prices, setPrices] = useState([]);

  const [loading, setLoading] = useState(false);


  // New state for dynamic options
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [buildingConditions, setBuildingConditions] = useState([]);

  useEffect(() => {
    // Fetch dynamic building types and conditions from the 'cleaning_prices' table
    const fetchOptions = async () => {
      try {
        const { data, error } = await supabase
          .from('cleaning_prices')
          .select('building_type, building_condition');
  
        if (error) throw error;
  
        // Extract unique building types and conditions by using Set
        const buildingTypesData = Array.from(new Set(data.map(item => item.building_type)));
        const buildingConditionsData = Array.from(new Set(data.map(item => item.building_condition)));
  
        setBuildingTypes(buildingTypesData); // Set building types state
        setBuildingConditions(buildingConditionsData); // Set building conditions state
        toast.success('Options loaded successfully!'); // Show success toast
      } catch (error) {
        console.error('Error fetching options:', error);
        toast.error('Error fetching dynamic options.');
      }
    };
  
    fetchOptions();
  }, []); // No need for timeoutID in the dependency array

  const handleSearch = async () => {
    setLoading(true); // Set loading to true while fetching prices

    try {
      const { data, error } = await supabase
        .from('cleaning_prices')
        .select('*') // Adjust this based on the fields you want
        .eq('building_type', buildingType)
        .eq('building_condition', buildingCondition)
        .eq('num_rooms', numRooms);

      if (error) throw error;

      if (data.length === 0) {
        toast.info('No matching prices found.');
      } else {
        setPrices(data); // Set the prices state with the fetched data
        toast.success('Prices loaded successfully!');
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      toast.error('Error fetching prices.');
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  


  

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Find Cleaning Prices</h2>

      <div className="mb-6 p-6 bg-white rounded-lg shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Building Type */}
          <div className="mb-4">
            <label htmlFor="buildingType" className="block text-lg font-medium">Building Type</label>
            <select
              id="buildingType"
              value={buildingType}
              onChange={(e) => setBuildingType(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Building Type</option>
              {buildingTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Building Condition */}
          <div className="mb-4">
            <label htmlFor="buildingCondition" className="block text-lg font-medium">Building Condition</label>
            <select
              id="buildingCondition"
              value={buildingCondition}
              onChange={(e) => setBuildingCondition(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Building Condition</option>
              {buildingConditions.map((condition, index) => (
                <option key={index} value={condition}>{condition}</option>
              ))}
            </select>
          </div>
          {/* Number of Rooms */}
          <div className="mb-4">
            <label htmlFor="numRooms" className="block text-lg font-medium">Number of Rooms</label>
            <select
              id="numRooms"
              value={numRooms}
              onChange={(e) => setNumRooms(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Number of Rooms</option>
              {[...Array(10).keys()].map(i => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="w-full p-2 bg-green-600 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Search Prices'}
      </button>

      {prices.length > 0 ? (
  <div className="mt-4">
    <h3 className="text-lg font-semibold">Available Prices:</h3>
    <ul className="space-y-2">
      {prices.map((price, index) => {
        const discountedPrice = price.base_price * (1 - price.discount_percentage / 100);
        return (
          <li key={index} className="p-4 border rounded">
            <div className="font-semibold">
              {`Base Price: ${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price.base_price)}`}
            </div>
            <div className="font-semibold text-green-600">
              {`Discounted Price: ${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(discountedPrice)}`}
            </div>
            <p>{`Number of Rooms: ${price.num_rooms}`}</p>
            <p>{`Building Type: ${price.building_type}`}</p>
            <p>{`Building Condition: ${price.building_condition}`}</p>
            <p>{`Discount: ${price.discount_percentage}%`}</p>
            <p>{`Description: ${price.description}`}</p>
          </li>
        );
      })}
    </ul>
  </div>
      ) : (
        <p></p>
      )}

      {/* Contact Us Button
      <div className="bg-green-700 text-white p-6 rounded-lg shadow-md text-center mt-6">
        <h3 className="text-2xl font-semibold mb-4">Need Specialized Services?</h3>
        <p className="mb-4">Reach out to us by filling out this form and we&apos;d get back to you as soon as possible. Thank You!</p>
       
      </div> */}

      {/* Modal for Contact Us */}
     
    </div>
  );
};

export default CleaningPriceComponent;
