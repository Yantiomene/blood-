"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../api/user';

const ProfilePage: React.FC = () => {
    const router = useRouter();
    const inputStyles = "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
    const isLoggedin = localStorage.getItem('isAuth') || false;

    if (!isLoggedin) {
        router.push('/auth/login');
    }

    const [userData, setUserData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [inputData, setInputData] = useState<any>({
        username: '',
        email: '',
        bloodType: '',
        location: '',
        isVerified: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCurrentUser();
                setUserData(data.user);
            } catch (error) {
                setError('Failed to fetch user profile');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputData({
            ...inputData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Perform form submission logic here
    };

    return (
        <div className="container mx-auto mt-8 md:w-[60%]">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="p-8 bg-white rounded-md">
                    <h1 className="text-2xl font-bold mb-4">User Profile</h1>
                    <p><span className="font-bold">Username:</span> {userData.username}</p>
                    <p><span className="font-bold">Email:</span> {userData.email}</p>
                    <p><span className="font-bold">Blood Type:</span> {userData.bloodType}</p>
                    <p><span className="font-bold">Location:</span> {userData.location}</p>
                    <p><span className="font-bold">Verified:</span> {userData.isVerified ? 'Yes' : 'No'}</p>

                    <form className="w-[90vw] md:w-[40vw] bg-white shadow-md rounded px-8 py-8 mb-4">
                        {/* {registerError && <p className="text-red-500 mb-4">{registerError}</p>} */}
                        <div className="mb-4">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={inputData.email}
                                onChange={handleInputChange}
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
                                value={inputData.username}
                                onChange={handleInputChange}
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
                                value={inputData.password}
                                onChange={handleInputChange}
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
                                value={inputData.confirmPassword}
                                onChange={handleInputChange}
                                className={inputStyles}
                                aria-describedby="confirmPasswordHelpText"
                            />
                            <small id="confirmPasswordHelpText" className="text-gray-500">Please re-enter your password.</small>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="bloodType">Blood Type</label>
                            <select
                                id="bloodType"
                                value={inputData.bloodType}
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

                        <button
                            // onClick={handleRegister}
                            className="bg-red-500 inline-block w-full hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Register
                        </button>
                        <p className="text-gray-500 text-center mt-4 text-sm">
                            Already have an account? <a className='text-red-500 hover:text-red-400' href="/auth/login">Login</a>
                        </p>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
