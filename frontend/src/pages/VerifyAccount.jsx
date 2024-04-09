import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showMessage } from "../redux/globalComponentSlice";
import { requestNewToken, verifyEmail } from "../api/user";
import { HOMEROUTE } from "../api";
import AuthRequired from "../layouts/authRequired";


const VerifyAccount = ({ currentUser: user }) => {
    const [codes, setCodes] = useState(['', '', '', '', '']);
	const [isLoading, setLoading] = useState(false);
    const router = useNavigate();
    const dispatch = useDispatch();

    const handleCodeChange = (index, value) => {
        // Ensure only digits are entered
        const digit = value.replace(/\D/, '');
        const newCodes = [...codes];
        newCodes[index] = digit;
        setCodes(newCodes);
    };

    const handleRequestNewToken = async () => {
        setLoading(true)
        try {
            const response = await requestNewToken({email: user.email});
            if (response.success) {
                dispatch(showMessage({heading: "Success", text: 'New verification email sent!'}));
            }
        } catch (error) {
            console.error('Error requesting new token:', error.message);
        }
        setLoading(false);
    }

    const handleVerify = async () => {
		const code = codes.join('');
        if (code.length !== 5) {
            dispatch(showMessage({heading: "Error", text: 'Please enter a 5-digit PIN.'}));
            return;
        }
        
		setLoading(true);
        try {
            const response = await verifyEmail(code);
			if (response.success){
                dispatch(showMessage({heading: "Success", text: 'PIN verified successfully'}));
				router(HOMEROUTE);
			}
        } catch (error) {
            dispatch(showMessage({heading: "Error", text: 'PIN verification failed. Please try again'}));
            console.log("Error verifying user:", error.message);
        }
        setLoading(false);
    };

    return (
      <>
        <div className="w-[90vw] md:w-[40vw] mt-[10%] bg-white shadow-md rounded px-8 py-8 mb-4">
            <h2 className="text-2xl font-semibold mb-4">PIN Verification</h2>
            <p className="my-4">
                A verification pin to your email <span className="italic text-red-500">@{user?.email}</span>.
            </p>
            <div className="flex mb-4">
                {codes.map((code, index) => (
                    <input
                        key={index}
                        type="text"
                        value={code}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        className="flex-1 w-20 mr-2 p-2 border rounded-md text-center"
                        maxLength={1}
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />
                ))}
            </div>
            <button
                className={`inline-block w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? " bg-gray-500" : " bg-red-500 hover:bg-red-700"}`}
                type="submit"
                disabled={isLoading}
                onClick={handleVerify}
            >
                {isLoading ? 'Loading...' : 'Verify'}
            </button>
        </div>
        <div>
            <p className="text-center text-gray-500 text-sm">
                Didn't receive the email? <button onClick={handleRequestNewToken}>Resend</button>
            </p>
        </div>
      </>
  );
};

export default AuthRequired(VerifyAccount);
