"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import withAuth from '../components/authHOC';
import { getCurrentUser, updateProfile } from '../api/user';

interface UserData {
    username: string;
    email: string;
    bloodType: string;
    isDonor: boolean;
    location: [number, number];
    contactNumber: string;
}

const inputStyles = "grow-0 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
const editStyles = "bg-blue-500 text-white rounded-md px-2 py-1 mt-2 focus:outline-none focus:bg-blue-600"
const fieldStyles = "mb-4 flex items-center gap-4"
const labelStyles = "block mb-1"
let messageStyles = "text-center mt-4 text-gray-600 italic"

const UpdateUserProfile: React.FC = () => {
    const [formData, setFormData] = useState<UserData>({
        username: '',
        email: '',
        bloodType: '',
        isDonor: false,
        location: [0, 0],
        contactNumber: ''
    });
    const [Message, setMessage] = useState<string>('');
    const [editableFields, setEditableFields] = useState<Record<string, boolean>>({
        username: false,
        email: false,
        bloodType: false,
        isDonor: false,
        location: false,
        contactNumber: false
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getCurrentUser();
                if (data.success) {
                    setFormData(data.user);
                    console.log(">> formdata: ", data.user)
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

    const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const [longitude, latitude] = value.split(',').map(parseFloat);
        setFormData({ ...formData, location: [longitude, latitude] });
    };

    const handleEditField = (fieldName: keyof UserData) => {
        setEditableFields({ ...editableFields, [fieldName]: true });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await updateProfile(formData);
            setMessage(response.message);
        } catch (error: any) {
            setMessage(error.message);
        }
    };
    return (
        <>
            <h2 className="text-2xl font-bold mb-4">User Profile</h2>
            {Message && <p className={messageStyles}>{Message}</p>}
            <form onSubmit={handleSubmit} className="w-[90vw] md:w-[40vw] bg-white shadow-md rounded px-8 py-8 mb-4">
                <div className={fieldStyles}>
                    <label className={labelStyles}>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={inputStyles}
                        disabled={!editableFields.username}
                    />
                    {!editableFields.username && (
                        <button
                            type="button"
                            onClick={() => handleEditField('username')}
                            className={editStyles}
                        >
                            Edit
                        </button>
                    )}
                </div>
                <div className={fieldStyles}>
                    <label className={labelStyles}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputStyles}
                        disabled={!editableFields.email}
                    />
                    {!editableFields.email && (
                        <button
                            type="button"
                            onClick={() => handleEditField('email')}
                            className={editStyles}
                        >
                            Edit
                        </button>
                    )}
                </div>
                <div className={fieldStyles}>
                    <label className={labelStyles}>Blood Type</label>
                    <input
                        type="text"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className={inputStyles}
                        disabled={!editableFields.bloodType}
                    />
                    {!editableFields.bloodType && (
                        <button
                            type="button"
                            onClick={() => handleEditField('bloodType')}
                            className={editStyles}
                        >
                            Edit
                        </button>
                    )}
                </div>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <label className="select-none">Are you a donor?</label>
                        <input
                            type="checkbox"
                            name="isDonor"
                            checked={formData.isDonor}
                            onChange={handleCheckboxChange}
                            className="m-2"
                        />
                    </div>

                    <div className={fieldStyles}>
                        <label className={labelStyles}>Location</label>
                        <input
                            type="text"
                            name="location"
                            onChange={handleLocationChange}
                            className={inputStyles}
                        />
                    </div>

                </div>

                <div className={fieldStyles}>
                    <label className={labelStyles}>Contact Number</label>
                    <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className={inputStyles}
                        disabled={!editableFields.contactNumber}
                    />
                    {!editableFields.contactNumber && (
                        <button
                            type="button"
                            onClick={() => handleEditField('contactNumber')}
                            className={editStyles}
                        >
                            Edit
                        </button>
                    )}
                </div>

                <button
                    className="bg-red-500 inline-block w-full hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Update
                </button>
            </form>
        </>
    );
};

export default withAuth(UpdateUserProfile);
