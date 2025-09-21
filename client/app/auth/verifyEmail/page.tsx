"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyEmail } from '../../api/user';
import axios from 'axios';

const VerifyEmailPage: React.FC = () => {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleVerification = async () => {
    if (!verificationCode.trim()) {
      setStatus('Please enter the 5-digit code sent to your email.');
      return;
    }
    setIsSubmitting(true);
    setStatus(null);
    try {
      const response = await verifyEmail(verificationCode.trim());
      if (response.success) {
        setStatus('Verification successful! Redirecting to login...');
        setTimeout(() => router.push('/login?verified=1'), 1500);
      } else {
        setStatus(response.error || 'Verification failed. Please try again.');
      }
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.message || 'Error verifying email. Please try again.';
      setStatus(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!resendEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(resendEmail)) {
      setResendStatus('Please enter a valid email address.');
      return;
    }
    setResendStatus(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
      const { data } = await axios.post(`${apiUrl}/requestNewToken`, { email: resendEmail });
      if (data.success) {
        setResendStatus('A new verification code has been sent. Check your inbox.');
      } else {
        setResendStatus(data.error || 'Failed to send new code.');
      }
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.message || 'Error sending new code.';
      setResendStatus(msg);
    }
  };

  return (
    <div className="container mx-auto max-w-md text-center mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-2">Verify your email</h1>
      <p className="text-gray-600 mb-6">Enter the 5-digit code we emailed you to activate your account.</p>

      <div className="mb-4">
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter 5-digit code"
          maxLength={5}
          className="border p-2 w-full rounded"
        />
      </div>
      <button
        onClick={handleVerification}
        disabled={isSubmitting}
        className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white px-4 py-2 rounded w-full"
      >
        {isSubmitting ? 'Verifying...' : 'Verify'}
      </button>
      {status && <p className="mt-3 text-sm text-gray-700">{status}</p>}

      <hr className="my-6" />
      <h2 className="text-xl font-semibold mb-2">Didn't get a code?</h2>
      <p className="text-gray-600 mb-3">Resend a new verification code to your email.</p>
      <div className="flex gap-2 mb-3">
        <input
          type="email"
          value={resendEmail}
          onChange={(e) => setResendEmail(e.target.value)}
          placeholder="Enter your email"
          className="border p-2 flex-1 rounded"
        />
        <button onClick={handleResend} className="bg-gray-800 text-white px-3 py-2 rounded">Resend</button>
      </div>
      {resendStatus && <p className="text-sm text-gray-700">{resendStatus}</p>}

      <p className="text-gray-500 text-sm mt-6">
        Used the wrong email? <a className="text-red-500 hover:text-red-400" href="/register">Register a new account</a>
      </p>
    </div>
  );
};

export default VerifyEmailPage;
