"use client";

import { useState } from 'react';
import { useRouter } from 'next/router';
import { verifyEmail } from '../../api/user';

const VerifyEmailPage: React.FC = () => {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');

  const handleVerification = async () => {
    try {
      const response = await verifyEmail(verificationCode);
      if (response.success) {
        setVerificationStatus('Verification successful. Redirecting to login...');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000); // Redirect to login page after 2 seconds
      } else {
        setVerificationStatus('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      setVerificationStatus('Error verifying email. Please try again.');
    }
  };

  const handleRegisterNewAccount = () => {
    // Redirect to the registration page or handle the registration logic here
    router.push('/auth/register');
  };

  return (
    <div className="container mx-auto text-center mt-10">
      <h1 className="text-4xl font-bold mb-4">Email Verification</h1>
      <p>Enter the verification code:</p>
      <input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        className="border p-2 mb-4"
      />
      <button onClick={handleVerification} className="bg-blue-500 text-white px-4 py-2 mr-2">
        Verify
      </button>
      <button onClick={handleRegisterNewAccount} className="bg-green-500 text-white px-4 py-2">
        Register a New Account
      </button>
      <p>{verificationStatus}</p>
    </div>
  );
};

export default VerifyEmailPage;
