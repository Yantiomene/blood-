"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [bloodType, setBloodType] = useState('');
    const [location, setLocation] = useState('');
    const [contact, setContact] = useState('');

    const handleRegister = () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // to be continued...
    };

    const inputStyles = "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";

    return (
        <>
            <h1 className="text-4xl text-red-500 font-bold"><Link href='/'>Blood+</Link></h1>
            <p className="text-2xl text-gray-700 font-bold mb-4">Register</p>
            <form className="w-[90vw] md:w-[40vw] bg-white shadow-md rounded px-8 py-8 mb-4">
                <div className="mb-4">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputStyles}
                        aria-describedby="emailHelpText"
                    />
                    <small id="emailHelpText" className="text-gray-500">We'll never share your email with anyone else.</small>
                </div>

                <div className="mb-4">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={inputStyles}
                        aria-describedby="usernameHelpText"
                    />
                    <small id="usernameHelpText" className="text-gray-500">Choose a unique username.</small>
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
                    />
                    <small id="passwordHelpText" className="text-gray-500">Must be at least 8 characters long.</small>
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={inputStyles}
                        aria-describedby="confirmPasswordHelpText"
                    />
                    <small id="confirmPasswordHelpText" className="text-gray-500">Please re-enter your password.</small>
                </div>

                <div className="mb-4">
                    <label htmlFor="bloodType">Blood Type</label>
                    <select
                        id="bloodType"
                        value={bloodType}
                        onChange={(e) => setBloodType(e.target.value)}
                        className={inputStyles}
                        aria-describedby="bloodTypeHelpText"
                    >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                    <small id="bloodTypeHelpText" className="text-gray-500">Select your blood type.</small>
                </div>

                <div className="mb-4">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={inputStyles}
                        aria-describedby="locationHelpText"
                    />
                    <small id="locationHelpText" className="text-gray-500">Enter your current location.</small>
                </div>

                <div className="mb-4">
                    <label htmlFor="contact">Contact</label>
                    <input
                        type="text"
                        id="contact"
                        placeholder="Contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className={inputStyles}
                        aria-describedby="contactHelpText"
                    />
                    <small id="contactHelpText" className="text-gray-500">Enter your contact information.</small>
                </div>

                <button
                    onClick={handleRegister}
                    className="bg-red-500 inline-block w-full hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Register
                </button>
                <p className="text-gray-500 text-center mt-4 text-sm">
                    Already have an account? <a className='text-red-500 hover:text-red-400' href="/auth/register">Login</a>
                </p>
            </form>
        </>
    );
};

export default RegisterPage;