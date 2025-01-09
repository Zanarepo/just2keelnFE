import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Ensure supabaseClient is correctly imported
import { toast } from 'react-toastify';

const CleaningPriceComponent = () => {
  const [buildingType, setBuildingType] = useState("");
  const [buildingCondition, setBuildingCondition] = useState("");
  const [numRooms, setNumRooms] = useState("");
  const [prices, setPrices] = useState([]);
  const [contactInfo, setContactInfo] = useState({ fullName: "", phone_number: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Clear search results after 1 minute (60000 ms)
    if (prices.length > 0) {
      const timer = setTimeout(() => {
        setPrices([]);
      }, 60000); // 1 minute

      return () => clearTimeout(timer); // Cleanup timer on component unmount or on price change
    }
  }, [prices]);

  const handleSearch = async () => {
    if (!buildingType || !buildingCondition || !numRooms) {
      toast.error("Please select all criteria.");
      return;
    }

    setLoading(true);

    try {
      // Query the Supabase table to get the prices
      const { data, error } = await supabase
        .from("cleaning_prices")
        .select("base_price, num_rooms")
        .eq("building_type", buildingType)
        .eq("building_condition", buildingCondition)
        .gte("num_rooms", numRooms)  // greater than or equal to numRooms
        .lte("num_rooms", numRooms); // less than or equal to numRooms

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Remove duplicate results based on num_rooms and base_price
        const uniquePrices = Array.from(
          new Map(data.map((item) => [item.num_rooms + item.base_price, item])).values()
        );
        setPrices(uniquePrices);
        toast.success("Prices fetched successfully.");
      } else {
        toast.info("No prices found for the selected criteria.");
      }
    } catch (error) {
      console.error("Error fetching prices:", error);
      toast.error("Error fetching prices.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactInfo.fullName || !contactInfo.phone_number || !contactInfo.email || !contactInfo.message) {
      toast.error("Please fill out all fields.");
      return;
    }
    toast.success("Your message has been sent!");
    setContactInfo({ fullName: "", phone_number: "", email: "", message: "" });
    setShowModal(false);  // Close the modal after submission
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
     <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
  Find Cleaning Prices
</h2>

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
        <option value="Apartment">Apartment</option>
        <option value="Duplex">Duplex</option>
        <option value="Office">Office</option>
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
        <option value="New">New</option>
        <option value="Old">Old</option>
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
        {loading ? "Loading..." : "Search Prices"}
      </button>
      {prices.length > 0 && (
  <div className="mt-4">
    <h3 className="text-lg font-semibold">Available Prices:</h3>
    <ul className="space-y-2">
      {prices.map((price, index) => (
        <li key={index} className="p-4 border rounded">
          <div className="font-semibold">
            {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price.base_price)}
          </div>
          <p>{`Number of Rooms: ${price.num_rooms}`}</p>
        </li>
      ))}
    </ul>
  </div>
)}

    

      {/* Contact Us Button */}
      <div className="bg-green-700 text-white p-6 rounded-lg shadow-md text-center mt-6">
  <h3 className="text-2xl font-semibold mb-4">Need Specialized Services?</h3>
  <p className="mb-4">Reach out to us by filling out this form and we&#39;d get back to you as soon as possible. Thank You!</p>
  <button
    onClick={() => setShowModal(true)} // Trigger the modal to show form
    className="bg-white text-green-700 font-semibold py-2 px-6 rounded-lg shadow hover:bg-gray-100 transition duration-300"
  >
    Fill Out the Form
  </button>
</div>



    {/* Modal for Contact Us */}


{showModal && (
  <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-80 relative">
      <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
   
      <form onSubmit={handleContactSubmit}>
        <div className="mb-4">
          <label htmlFor="fullName" className="block">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={contactInfo.fullName}
            onChange={(e) => setContactInfo({ ...contactInfo, fullName: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone_number" className="block">Phone Number</label>
          <input
            type="number"
            id="phone_number"
            value={contactInfo.phone_number}
            onChange={(e) => setContactInfo({ ...contactInfo, phone_number: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block">Email</label>
          <input
            type="email"
            id="email"
            value={contactInfo.email}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block">Message</label>
          <textarea
            id="message"
            value={contactInfo.message}
            onChange={(e) => setContactInfo({ ...contactInfo, message: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <button type="submit" className="w-full p-2 bg-green-600 text-white rounded">
          Send Message
        </button>
      </form>

      {/* Close Button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-2 right-2 text-xl text-gray-500"
      >
        ×
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default CleaningPriceComponent;
