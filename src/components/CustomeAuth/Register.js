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
    toast.info(`You have selected ${role} registration`);
  };

  const handleBack = () => {
    setStep(1);
    toast.info('Back to role selection');
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md  flex flex-col justify-center items-center p-8">
        {step === 1 && (
          <>
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>
            <div className="flex justify-center items-center space-x-4 w-full">
              <button
                onClick={() => handleButtonClick('Client')}
                className="bg-blue-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base"
              >
                Register as Client
              </button>
              <button
                onClick={() => handleButtonClick('Cleaner')}
                className="bg-green-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none text-sm sm:text-base"
              >
                Register as Cleaner
              </button>
            </div></div>
          </>
        )}

        {step === 2 && (
          <div className="w-full max-w-md space-y-4">
            {role === 'Client' && <ClientRegistration />}
            {role === 'Cleaner' && <CleanerRegistration />}
            <button
  onClick={handleBack}
  className="mt-4 w-full sm:w-auto bg-gray-300 text-gray-700 py-2 px-6 rounded-md font-semibold hover:bg-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none text-sm sm:text-base mx-auto block"
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
