import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientRegistration from './ClientsReg';  // Assuming this component exists
import CleanerRegistration from './CleanersReg';  // Assuming this component exists




const SignUp = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');

  const handleButtonClick = (role) => {
    setRole(role);
    setStep(2); // Proceed to the registration form after selecting the role
    toast.info();
  };

  const handleBack = () => {
    setStep(1);
    toast.info('Back to role selection');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white-100">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-10">
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
            <div className="flex flex-col space-y-6">
              <button
                onClick={() => handleButtonClick('Client')}
                className="w-full bg-blue-500 text-white py-4 px-6 rounded-md font-semibold text-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                Register as Client
              </button>
              <button
                onClick={() => handleButtonClick('Cleaner')}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-md font-semibold text-lg hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none"
              >
                Register as Cleaner
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {role === 'Client' && <ClientRegistration />}
            {role === 'Cleaner' && <CleanerRegistration />}
            <button
              onClick={handleBack}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-gray-200 focus:outline-none"
 >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
