"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import withAuth from '../components/authHOC';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, updateUserProfile } from '../redux/userSlice';
import { useRouter } from 'next/navigation';

interface UserData {
    username: string;
    email: string;
    bloodType: string;
    isDonor: boolean;
    // Keep location as a string in the form for easier editing; submit as [lon, lat]
    location: string;
    contactNumber: string;
}

const inputStyles = "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
const editStyles = "bg-blue-500 text-white rounded-md px-2 py-1 mt-2 focus:outline-none focus:bg-blue-600"
const fieldStyles = "mb-4 flex items-center gap-4"
const labelStyles = "block mb-1"
const messageStyles = "text-center mt-4 text-gray-600 italic"

// Helper to format user state from store into editable form data
function normalizeUserToForm(user: any): UserData {
    let locStr = '';
    // If backend provides location as [lon, lat]
    if (Array.isArray(user?.location) && user.location.length === 2) {
        const [lon, lat] = user.location;
        locStr = `${lon}, ${lat}`;
    } else if (typeof user?.location === 'string') {
        // If already a comma string, keep as-is; otherwise leave empty
        locStr = user.location.includes(',') ? user.location : '';
    }
    return {
        username: user?.username || '',
        email: user?.email || '',
        bloodType: user?.bloodType || '',
        isDonor: !!user?.isDonor,
        location: locStr,
        contactNumber: user?.contactNumber || '',
    };
}

function parseLocation(input: string): [number, number] | null {
    if (!input) return null;
    const parts = input.split(',').map(s => parseFloat(s.trim()));
    if (parts.length !== 2 || parts.some(n => Number.isNaN(n))) return null;
    // Expect input as "lon, lat"
    const [lon, lat] = parts;
    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) return null;
    return [lon, lat];
}

const UpdateUserProfile: React.FC = () => {
    const [Message, setMessage] = useState<string>('');
    const user = useSelector((state: any) => state.user.data);
    const [formData, setFormData] = useState<UserData>(normalizeUserToForm(user));
    const [editableFields, setEditableFields] = useState<Record<string, boolean>>({
        username: false,
        email: false,
        bloodType: false,
        isDonor: false,
        location: false,
        contactNumber: false
    });
    const [isLocating, setIsLocating] = useState(false);

    const router = useRouter();
    const dispatch = useDispatch<any>();

    // Fetch current user on mount
    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    // When user in store changes, sync into form
    useEffect(() => {
        setFormData(normalizeUserToForm(user));
    }, [user]);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleEditField = (fieldName: keyof UserData) => {
        setEditableFields(prev => ({ ...prev, [fieldName]: true }));
    };

    const useMyLocation = () => {
        if (!navigator.geolocation) {
            setMessage('Geolocation is not supported by your browser.');
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setFormData(prev => ({ ...prev, location: `${longitude}, ${latitude}` }));
                setEditableFields(prev => ({ ...prev, location: true }));
                setIsLocating(false);
            },
            (err) => {
                console.error('Geolocation error:', err);
                setMessage('Unable to fetch your location. Please allow location access or enter it manually.');
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage('');
        try {
            const parsed = parseLocation(formData.location);
            if (!parsed) {
                setMessage('Please enter a valid location as "longitude, latitude" or click "Use my location".');
                return;
            }
            const payload = {
                username: formData.username,
                email: formData.email,
                bloodType: formData.bloodType,
                isDonor: formData.isDonor,
                location: parsed, // [lon, lat]
                contactNumber: formData.contactNumber,
            } as any;

            // Dispatch thunk and check for rejection manually to avoid TS unwrap issues
            const resultAction = await (dispatch((updateUserProfile as any)(payload)) as any);
            if ((resultAction as any)?.error) {
                throw (resultAction as any).error;
            }
            // Refresh user profile
            await (dispatch(fetchCurrentUser()) as any);
            setMessage('Profile updated successfully.');
            // Stay on page; do not auto-redirect so user can see success
        } catch (error: any) {
            const serverMsg = error?.response?.data?.error || error?.message;
            setMessage(serverMsg || 'An error occurred while updating your profile.');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="w-[90vw] md:w-[40vw] bg-white rounded px-8 py-8 mb-4">
                {Message && <p className={messageStyles}>{Message}</p>}
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
                    <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className={inputStyles}
                        aria-describedby="bloodTypeHelpText"
                        disabled={!editableFields.bloodType}
                    >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
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
                            onChange={handleChange}
                            placeholder='longitude, latitude'
                            className={inputStyles}
                            value={formData.location}
                            disabled={!editableFields.location}
                        />
                        {!editableFields.location && (
                            <button
                                type="button"
                                onClick={() => handleEditField('location')}
                                className={editStyles}
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                <div className="mb-4 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={useMyLocation}
                        className="bg-gray-700 text-white rounded-md px-3 py-2 disabled:opacity-60"
                        disabled={isLocating}
                    >
                        {isLocating ? 'Fetching location…' : 'Use my location'}
                    </button>
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
