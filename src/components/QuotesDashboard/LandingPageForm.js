import React, { useState } from 'react';
import AnonRequestQuoteForm from './AnonRequestQuoteForm'; // Your existing GuestBookingForm component
import AnonRequestQuote from './AnonRequestQuote'; // Your existing QuoteRequestForm component

const LandingPageForm = () => {
  const [showModal, setShowModal] = useState(false); // To show/hide the modal
  const [formType, setFormType] = useState(''); // To determine which form to show in the modal

  // Handle form selection
  const handleFormSelection = (type) => {
    setFormType(type); // Set the form type based on user selection
    setShowModal(true); // Open the modal
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setFormType(''); // Reset the form type when modal is closed
  };

  return (
    <div className="landing-page flex justify-center items-center h-screen bg-gray-100">
      <div className="form-selection space-x-4 mb-4">
        <button 
          onClick={() => handleFormSelection('booking')} 
          className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700">
          Guest Booking
        </button>
        <button 
          onClick={() => handleFormSelection('quote')} 
          className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Request a Quote
        </button>
      </div>

      {/* Modal to show the selected form */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-full p-0 m-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {formType === 'booking' ? 'Guest Booking Form' : 'Quote Request Form'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>

            {/* Modal Body with Scrollable Content */}
            <div className="modal-body max-h-[80vh] overflow-auto">
              {/* Form selection for Guest Booking or Quote Request */}
              {formType === 'booking' && <AnonRequestQuoteForm />}
              {formType === 'quote' && <AnonRequestQuote />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPageForm;
