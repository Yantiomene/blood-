import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGINROUTE, REGISTERROUTE } from '../api';
import { requestPasswordReset, resetPasswordWithPIN } from '../api/user';
import { useDispatch } from 'react-redux';
import { showMessage } from "../redux/globalComponentSlice";
import Loader from './loader';
import Logo from './logo';

const ResetPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [codes, setCodes] = useState(['', '', '', '', '']);
    const [pinRequestSuccess, setpinRequestSuccess] = useState(false);
    const [checkPassword, setCheckPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useNavigate();
    const dispatch = useDispatch();

    const handleCodeChange = (index, value) => {
        // Ensure only digits are entered
        const digit = value.replace(/\D/, '');
        const newCodes = [...codes];
        newCodes[index] = digit;
        setCodes(newCodes);
    };

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value.length >= 3)
            setCheckPassword(true);
        else
            setCheckPassword(false);
    }

    const handlePINRequest = async (event) => {
        event.preventDefault();

        setIsLoading(true);

        try {
            const response = await requestPasswordReset({ email });
            if (response.success) {
                setpinRequestSuccess(true);
                dispatch(showMessage({ heading: 'Success', text: `${response.message}` }))
            }
        } catch (error) {
            dispatch(showMessage({ heading: "Error", text: "Unable to send code to email" }));
        }

        setIsLoading(false);
    };

    const handlePasswordReset = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const code = codes.join('');
        if (code.length !== 5) {
            dispatch(showMessage({ heading: "Error", text: 'Please enter a 5-digit PIN.' }));
            setIsLoading(false);
            return;
        }

        try {
            const response = await resetPasswordWithPIN({ code, password })
            if (response.success) {
                dispatch(showMessage({ heading: "Success", text: `${response.message}` }));
                router(LOGINROUTE);
            }
        } catch (error) {
            dispatch(showMessage({ heading: "Error", text: "Unable to reset password. Check PIN or Password" }))
        }

        setIsLoading(false);
    }

    const inputStyles = "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";

    return (
        <div className='mt-[10%] '>
            <Logo />
            <form
                onSubmit={pinRequestSuccess ? handlePasswordReset : handlePINRequest}
                className="w-[90vw] md:w-[40vw] my-4 bg-white shadow-md rounded px-8 py-8 mb-4 overflow-hidden"
            >
                {pinRequestSuccess ?

                    <div className='slide-in'>
                        <h3 className='text-2xl my-2 font-bold text-gray-400'>Enter PIN and New Password</h3>
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


                        <div className="mb-4">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputStyles}
                                aria-describedby="passwordHelpText"
                                required={true}
                            />
                            <small id="passwordHelpText" className="text-gray-500">Must be at least 8 characters long.</small>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            {
                                checkPassword &&
                                <small className={`rounded p-2 block ${confirmPassword === password ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                                    {
                                        confirmPassword === password ?
                                            "Passwords do match"
                                            :
                                            "Passwords do NOT match"
                                    }
                                </small>
                            }
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={handleConfirmPassword}
                                className={inputStyles}
                                aria-describedby="confirmPasswordHelpText"
                                required={true}
                            />
                            <small id="confirmPasswordHelpText" className="text-gray-500">
                                Please re-enter your password.
                            </small>
                        </div>


                        <button
                            className={`inline-block w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? " bg-red-200" : " bg-red-500 hover:bg-red-700"}`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader /> : 'Reset Password'}
                        </button>
                    </div>

                    :
                    <div>
                        <h3 className='text-2xl my-2 font-bold text-gray-400'>Request for Password Reset</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className={inputStyles}
                                id="email"
                                type="email"
                                placeholder="Enter an active email to receive reset pin code"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>

                        <button
                            className={`inline-block w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? " bg-red-200" : " bg-red-500 hover:bg-red-700"}`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader /> : 'Send Code'}
                        </button>
                    </div>
                }
                <p className="text-gray-500 text-center mt-4 text-sm">
                    Or you can just <a className='text-red-500 hover:text-red-400' href={LOGINROUTE}>login</a>
                    <br />
                    Don't have an account? <a className='text-red-500 hover:text-red-400' href={REGISTERROUTE}>Register</a>
                </p>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
