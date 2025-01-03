import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SpecializationComponent = ({ onUpdate }) => {
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [availability, setAvailability] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const specializationOptions = [
    'Vehicle Cleaning',
    'Event Cleaning',
    'Specialty Cleaning',
    'Industrial Cleaning',
    'Commercial Cleaning',
    'Residential Cleaning',
  ];

  const email = localStorage.getItem('email');

  useEffect(() => {
    if (!email) {
      toast.error('User email not found. Please log in again.');
      return;
    }

    const fetchSpecialization = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('cleaners_main_profiles')
          .select('specialization, availability')
          .eq('email', email)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setSelectedSpecializations(data.specialization ? data.specialization.split(',') : []);
          setAvailability(data.availability || '');
          if (typeof onUpdate === 'function') {
            onUpdate({
              specialization: data.specialization || '',
              availability: data.availability || '',
            });
          } else {
            console.warn('onUpdate is not a function.');
          }
        }
      } catch (error) {
        console.error('Error fetching specialization:', error);
        toast.error('Failed to load specialization details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecialization();
  }, [email, onUpdate]);

  const handleToggleSpecialization = (specialization) => {
    setSelectedSpecializations((prevSelected) => {
      if (prevSelected.includes(specialization)) {
        return prevSelected.filter((item) => item !== specialization);
      } else {
        return [...prevSelected, specialization];
      }
    });
  };

  const saveChanges = async () => {
    if (!email) {
      toast.error('User email not found. Please log in again.');
      return;
    }

    if (selectedSpecializations.length === 0 && availability.trim() === '') {
      toast.error('You must provide at least one specialization or set availability.');
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('cleaners_main_profiles')
        .update({
          specialization: selectedSpecializations.join(','),
          availability: availability.trim(),
        })
        .eq('email', email);

      if (error) {
        throw error;
      }

      toast.success('Changes saved successfully');
      setIsEditing(false);

      // Call onUpdate only if it's a valid function
      if (typeof onUpdate === 'function') {
        onUpdate({
          specialization: selectedSpecializations.join(','),
          availability: availability.trim(),
        });
      } else {
        console.warn('onUpdate is not a function.');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-center text-green-500">
          Service Specialization
        </h2>

        {/* Displaying current specializations or default message */}
        {isLoading ? (
          <p>Loading...</p>
        ) : selectedSpecializations.length > 0 ? (
          <div>
            <p className="text-sm font-medium text-gray-600 mb-4">
              Your Selected Specializations:
            </p>
            <ul className="list-disc pl-6">
              {selectedSpecializations.map((specialization) => (
                <li key={specialization} className="text-gray-700">
                  {specialization}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm font-medium text-gray-600 mb-4">
            You have not selected any specializations yet.
          </p>
        )}

        {/* Edit Specializations Button (Always Visible) */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-500 text-white py-2 px-4 rounded-lg mt-6 w-full"
          >
            {selectedSpecializations.length > 0 ? 'Edit Specializations' : 'Select Specializations'}
          </button>
        )}

        {/* Specialization List for Selection */}
        {isEditing && (
          <div>
            <p className="text-sm font-medium text-gray-600 mb-4">
              Select Specializations
            </p>
            <ul className="space-y-2">
              {specializationOptions.map((option) => (
                <li key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSpecializations.includes(option)}
                    onChange={() => handleToggleSpecialization(option)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">{option}</span>
                </li>
              ))}
            </ul>

            {/* Save Button */}
            <button
              onClick={() => {
                saveChanges();
                setIsEditing(false); // Hide the editing section after saving
              }}
              className="bg-green-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecializationComponent;
