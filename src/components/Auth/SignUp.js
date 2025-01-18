import React, { useState } from 'react';
import ClientRegistration from './ClientRegistration';
import CleanerSignup from './CleanerSignup';

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');

  return (
    <div className="">
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-6">
          {step === 1 ? 'Select Account Type' : 'Complete Registration'}
        </h2>
      </div>

      {step === 1 && (
        <div className="w-full max-w-md px-4 flex justify-center space-x-4">
          <button
            onClick={() => {
              setRole('client');
              setStep(2);
            }}
            className="w-full sm:w-auto bg-blue-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base"
          >
            Register as Client
          </button>
          <button
            onClick={() => {
              setRole('serviceProvider');
              setStep(2);
            }}
            className="w-full sm:w-auto bg-green-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none text-sm sm:text-base"
          >
            Register as Service Provider
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-lg px-4 flex flex-col justify-between">
          {role === 'client' && <ClientRegistration />}
          {role === 'serviceProvider' && <CleanerSignup />}
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-auto w-full sm:w-auto bg-gray-300 text-gray-700 py-2 px-6 rounded-md font-semibold hover:bg-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none text-sm sm:text-base mx-auto"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default SignUp;
