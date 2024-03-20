import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import WithoutHeader from "../layouts/withoutHeader";
import { verifyEmail } from "../api/user";
import { HOMEROUTE } from "../api";
import withCurrentUser from "../layouts/withCurrentUser";

// time would later be set relative to the time the email was sent

const VerifyAccount = () => {
    const [codes, setCodes] = useState(['', '', '', '', '']);
    const [verificationMessage, setVerificationMessage] = useState('');
	const [isLoading, setLoading] = useState(false);
	const [timeLeft, setTimeLeft] = useState(() => {
		const storedTimeLeft = localStorage.getItem("timeLeft");
		return storedTimeLeft ? parseInt(storedTimeLeft, 10) : 60 * 60; // Default to 1 hour if no value is stored
	});
    const router = useNavigate();
	const user = useSelector(selectUser);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prevSeconds) => {
				if (prevSeconds > 0) {
					localStorage.setItem("timeLeft", prevSeconds - 1);
					return prevSeconds - 1;
				} else {
					clearInterval(interval);
					return 0;
				}
			});
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleCodeChange = (index, value) => {
        // Ensure only digits are entered
        const digit = value.replace(/\D/, '');
        const newCodes = [...codes];
        newCodes[index] = digit;
        setCodes(newCodes);
    };

    const handleVerify = async () => {
		const code = codes.join('');
        if (code.length !== 5) {
			setVerificationMessage('Please enter a 5-digit PIN.');
            return;
        }
        
		setLoading(true);
        try {
            const response = await verifyEmail(code);
			if (response.success){
				setVerificationMessage('PIN verified successfully!');
				router(HOMEROUTE);
			}
        } catch (error) {
			setVerificationMessage('PIN verification failed. Please try again.');
            console.log("Error verifying user:", error.message);
			setLoading(false);
        }
    };

    return (
      <WithoutHeader>
        <div className="w-[90vw] md:w-[40vw] mt-[10%] bg-white shadow-md rounded px-8 py-8 mb-4">
            {
				timeLeft === 0 ? (
					<div className="mb-4 text-center">
						<p>Time expired. Please request a new PIN.</p><br/>
						<Link to={HOMEROUTE} className="text-blue-500">Resend PIN</Link>
					</div>
				)
				:
				(
					<>
					<h2 className="text-2xl font-semibold mb-4">PIN Verification</h2>
					<p className="my-4">
						A verification pin to your email <span className="italic text-red-500">@{user?.email}</span>. Check and verify within {Math.floor(timeLeft / 60)} minutes and {timeLeft % 60} seconds.
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
					{verificationMessage && (
						<p className="mt-4 text-sm text-gray-700">{verificationMessage}</p>
					)}
				</>
				)
			}
		</div>
      </WithoutHeader>
  );
};

export default withCurrentUser(VerifyAccount);
