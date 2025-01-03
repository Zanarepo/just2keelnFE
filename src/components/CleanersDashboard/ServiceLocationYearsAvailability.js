import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";

const ServiceLocationYearsAvailability = () => {
  const [serviceLocations, setServiceLocations] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [availability, setAvailability] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [statesOfResidence, setStatesOfResidence] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const email = localStorage.getItem("email"); // Retrieve email from localStorage

  // Fetch profile data when the component mounts
  useEffect(() => {
    if (email) {
      const fetchProfileData = async () => {
        try {
          const { data, error } = await supabase
            .from("cleaners_main_profiles")
            .select("service_locations, states_of_residence, years_of_experience, availability")
            .eq("email", email)
            .single();

          if (error) throw error;

          if (data) {
            setServiceLocations(data.service_locations || "");
            setStatesOfResidence(data.states_of_residence || "");
            setYearsOfExperience(data.years_of_experience || "");
            setAvailability(data.availability || "");
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to load profile data.");
        }
      };

      fetchProfileData();
    }
  }, [email]);

  const saveServiceDetails = async () => {
    if (!email) {
      toast.error("User email not found. Please log in again.");
      return;
    }
  
    if (!serviceLocations && !yearsOfExperience && !statesOfResidence && !availability) {
      toast.error("You must provide at least one service detail to update.");
      return;
    }
  
    try {
      // Create an object to hold only the fields that have changed
      const updatedFields = {};
  
      if (serviceLocations.trim()) updatedFields.service_locations = serviceLocations.trim();
      if (yearsOfExperience.trim()) updatedFields.years_of_experience = yearsOfExperience.trim();
      if (statesOfResidence.trim()) updatedFields.states_of_residence = statesOfResidence.trim();
      if (availability.trim()) updatedFields.availability = isAvailable ? availability.trim() : "";
  
      // If no changes were made (empty fields), inform the user
      if (Object.keys(updatedFields).length === 0) {
        toast.info("No changes detected.");
        return;
      }
  
      // Use Supabase's update method with the updated fields
      const { data, error } = await supabase
        .from("cleaners_main_profiles")
        .update(updatedFields)
        .eq("email", email);
  
      if (error) {
        throw error;
      }
  
      // Check if data exists after update
      if (data && data.length === 0) {
        toast.error("No matching profile found for the given email.");
      } else {
        toast.success("Service details saved successfully.");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving service details:", error);
      toast.error("Failed to save service details.");
    }
  };
  
  
  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 rounded-lg shadow-xl w-full sm:max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center text-green-500">
          Service Location, Experience, and Availability
        </h2>
  
        {/* Service Location Input */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Service Location
          </label>
          <input
            type="text"
            value={serviceLocations}
            onChange={(e) => setServiceLocations(e.target.value)}
            placeholder="Enter service locations"
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 hover:border-green-500 ${
              isEditing ? "" : "bg-gray-100"
            }`}
            disabled={!isEditing}
          />
        </div>
  
        {/* Years of Experience Dropdown */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Years of Experience
          </label>
          <select
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 hover:ring-2 hover:ring-green-500 ${
              isEditing ? "" : "bg-gray-100"
            }`}
            disabled={!isEditing}
          >
            <option value="">Select your years of experience</option>
            <option value="less_than_1_year">Less than 1 year</option>
            <option value="1_year">1 year</option>
            <option value="more_than_5_years">More than 5 years</option>
          </select>
        </div>
  
        {/* Availability Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Availability
          </label>
          <div className="flex items-center">
            <label className="mr-4">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={() => setIsAvailable(!isAvailable)}
                className="mr-2"
                disabled={!isEditing}
              />
              I am available
            </label>
  
            {isAvailable && (
              <div>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className={`p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 hover:ring-2 hover:ring-green-500 ${
                    isEditing ? "" : "bg-gray-100"
                  }`}
                  disabled={!isEditing}
                >
                  <option value="">Select availability type</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekends">Weekends</option>
                </select>
              </div>
            )}
          </div>
        </div>
  
        {/* States of Residence Input */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            States of Residence
          </label>
          <input
            type="text"
            value={statesOfResidence}
            onChange={(e) => setStatesOfResidence(e.target.value)}
            placeholder="Enter your state of residence"
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 hover:border-green-500 ${
              isEditing ? "" : "bg-gray-100"
            }`}
            disabled={!isEditing}
          />
        </div>
  
        {/* Edit/Save Button */}
        <div className="mt-6">
          {isEditing ? (
            <button
              onClick={saveServiceDetails}
              className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            >
              Edit Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default ServiceLocationYearsAvailability;
