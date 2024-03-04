"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import withAuth from '../components/authHOC';
import { getCurrentUser } from '../api/user';

interface UserData {
    username: string;
    email: string;
    bloodType: string;
    isDonor: boolean;
    contactNumber: string;
}

const UpdateUserProfile: React.FC = () => {
    const [formData, setFormData] = useState<UserData>({
        username: '',
        email: '',
        bloodType: '',
        isDonor: false,
        contactNumber: ''
    });
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getCurrentUser();
                if (data.success) {
                    console.log(">> user: ", data.user);
                    setFormData(data.user);
                }
            } catch (error: any) {
                console.error('Error fetching user data:', error.message);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.put('/api/updateUserProfile', formData);
            setSuccessMessage(response.data.message);
        } catch (error: any) {
            setErrorMessage(error.response.data.message);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500 px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500 px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1">Blood Type</label>
                    <input
                        type="text"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500 px-3 py-2"
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isDonor"
                        checked={formData.isDonor}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                    />
                    <label className="select-none">Are you a donor?</label>
                </div>
                <div>
                    <label className="block mb-1">Contact Number</label>
                    <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500 px-3 py-2"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                    Update Profile
                </button>
            </form>
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
        </div>
    );
};

export default withAuth(UpdateUserProfile);
