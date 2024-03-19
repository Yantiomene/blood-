import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WithoutHeader from "../layouts/withoutHeader";
import { verifyEmail } from "../api/user";
import { HOMEROUTE } from "../api";

const VerifyAccount = () => {
    const [code, setCode] = useState("");
    const [verificationMessage, setVerificationMessage] = useState('');
    const router = useNavigate();
  
    const handleVerify = async () => {
        if (code.length !== 5) {
          setVerificationMessage('Please enter a 5-digit PIN.');
		  return;
        } 
        
		try {
            await verifyEmail(code);
            setVerificationMessage('PIN verified successfully!');
            router.push(HOMEROUTE);
        } catch (error) {
            console.log("Error verifying user:", error.message);
        }
    };

    return (
      <WithoutHeader>
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">PIN Verification</h2>
        <div className="mb-4">
            <label htmlFor="pin" className="block text-gray-700">Enter PIN:</label>
            <input
                id="pin"
                type="number"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 p-2 border rounded-md w-full"
            />
        </div>
        <button
            onClick={handleVerify} 
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
        >Verify
        </button>
            {verificationMessage && (
                <p className="mt-4 text-sm text-gray-700">{verificationMessage}</p>
            )}
        </div>
      </WithoutHeader>
  );
};

export default VerifyAccount;
