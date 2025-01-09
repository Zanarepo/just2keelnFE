import React, { useState } from 'react';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
import AnonRequestQuoteForm from '../QuotesDashboard/AnonRequestQuoteForm'; // Your existing GuestBookingForm component
import AnonRequestQuote from '../QuotesDashboard/AnonRequestQuote'; // Your existing QuoteRequestForm component

const CTASection = () => {
  const [showModal, setShowModal] = useState(false); // To show/hide the modal
  const [formType, setFormType] = useState(''); // To determine which form to show in the modal

  // Handle form selection
  const handleFormSelection = (type) => {
    setFormType(type); // Set the form type based on user selection
    setShowModal(true); // Open the modal
    toast.info(`Opening ${type === 'booking' ? 'Guest Booking Form' : 'Quote Request Form'}`); // Toast notification when form is selected
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setFormType(''); // Reset the form type when modal is closed
    toast.success('Form closed successfully'); // Toast notification when modal is closed
  };

  return (
    <section className="cta-section py-16 bg-green-700 text-white">
      <div className="max-w-7xl mx-auto text-center px-6">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
          Ready to Experience Stress-Free Cleaning?
        </h2>
        <p className="text-lg sm:text-xl mb-8">
          Join thousands of satisfied clients and professionals today. Let’s make cleaning simple and hassle-free.
        </p>
        <div className="cta-buttons flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 items-center">
  <button 
    onClick={() => handleFormSelection('booking')} 
    className="cta-btn client-btn bg-white text-green-700 px-8 py-4 rounded-lg shadow-lg hover:bg-green-100 transition ease-in-out duration-200 w-full sm:w-auto">
    Request a Quote
  </button>
  <button 
    onClick={() => handleFormSelection('quote')} 
    className="cta-btn cleaner-btn bg-gray-800 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-gray-700 transition ease-in-out duration-200 w-full sm:w-auto">
    Find Your Cleaner
  </button>


        </div>
      </div>

      {/* Modal to show the selected form */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full sm:w-11/12 max-w-lg max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4 p-4">
              <h2 className="text-xl font-semibold text-gray-700">
                {formType === 'booking' ? 'Guest Booking Form' : 'Quote Request Form'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>

            <div className="modal-body p-0">
              {/* Conditional form rendering */}
              {formType === 'booking' && <AnonRequestQuoteForm />}
              {formType === 'quote' && <AnonRequestQuote />}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CTASection;
