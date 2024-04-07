import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import WithoutHeader from "../layouts/withoutHeader";
import { requestNewToken, verifyEmail } from "../api/user";
import { HOMEROUTE } from "../api";
import withCurrentUser from "../layouts/withCurrentUser";


const successStyle = "bg-green-100 border border-green-300";
const errorStyle = "bg-red-100 border border-red-300";

const VerifyAccount = () => {
    const [codes, setCodes] = useState(['', '', '', '', '']);
    const [verificationMessage, setVerificationMessage] = useState({
        message: '',
        success: false,
    });
	const [isLoading, setLoading] = useState(false);
    const router = useNavigate();
	const user = useSelector(selectUser);

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
                setVerificationMessage({message: 'New verification email sent!', success: true});
            }
        } catch (error) {
            console.error('Error requesting new token:', error.message);
        }
        setLoading(false);
    }

    const handleVerify = async () => {
		const code = codes.join('');
        if (code.length !== 5) {
			setVerificationMessage({message: 'Please enter a 5-digit PIN.', success: false});
            return;
        }
        
		setLoading(true);
        try {
            const response = await verifyEmail(code);
			if (response.success){
				setVerificationMessage({message: 'PIN verified successfully!', success: true});
				router(HOMEROUTE);
			}
        } catch (error) {
			setVerificationMessage({message: 'PIN verification failed. Please try again.', success: false});
            console.log("Error verifying user:", error.message);
        }
        setLoading(false);
    };

    return (
      <WithoutHeader>
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
            {(verificationMessage.message !== '') && (
                <p 
                    className={`${"mt-4 text-sm text-gray-700 p-2 " + (verificationMessage.success ? successStyle : errorStyle)}`}
                >{`${verificationMessage.message}`}
                </p>
            )}
        </div>
        <div>
            <p className="text-center text-gray-500 text-sm">
                Didn't receive the email? <button onClick={handleRequestNewToken}>Resend</button>
            </p>
        </div>
      </WithoutHeader>
  );
};

export default withCurrentUser(VerifyAccount);
