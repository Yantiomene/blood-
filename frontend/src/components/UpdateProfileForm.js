import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, updateUserProfile as updateProfile } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { DASHBOARDROUTE } from '../api';
// var wkx = require('wkx');
// const Buffer = require('buffer').Buffer;
// window.Buffer = Buffer;
// import wkx from 'wkx';
// import { Buffer } from 'buffer';
// window.Buffer = Buffer;


const inputStyles = "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
const editStyles = "bg-blue-500 text-white rounded-md px-2 py-1 mt-2 focus:outline-none focus:bg-blue-600"
const fieldStyles = "mb-4 flex items-center gap-4"
const labelStyles = "block mb-1"
const messageStyles = "text-center mt-4 text-gray-600 italic"

const UpdateUserProfile = () => {
    const [Message, setMessage] = useState('');
    const user = useSelector((state) => state.user.data);
    const [formData, setFormData] = useState(user);
    const [editableFields, setEditableFields] = useState({
        username: false,
        email: false,
        bloodType: false,
        isDonor: false,
        location: false,
        contactNumber: false
    });

    const router = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCurrentUser());
        setFormData(user);
    }, [dispatch, user]);

    useEffect(() => {
        if (user && user.location) {
            try {
                // const locationBuffer = Buffer.from(user.location, 'hex');
                const point = {x: 1, y: 2} //wkx.Geometry.parse(locationBuffer);
                const latitude = point.y;
                const longitude = point.x;
                console.log('Latitude:', latitude);
                console.log('Longitude:', longitude);
                setFormData({ ...formData, location: `${longitude}, ${latitude}` })
            } catch (error) {
                console.error('Error parsing location data:', error);
            }
        }
    }, [user, formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    };

    // const handleLocationChange = (e) => {
    //     const { value } = e.target;
    //     const [longitude, latitude] = value.split(',').map(parseFloat);
    //     setFormData({ ...formData, location: [longitude, latitude] });
    // };

    const handleEditField = (fieldName) => {
        setEditableFields({ ...editableFields, [fieldName]: true });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const [longitude, latitude] = formData.location.split(',').map(parseFloat);
            setFormData({ ...formData, location: [longitude, latitude] });
            dispatch(updateProfile(formData));
            router(DASHBOARDROUTE);
            setMessage('successfully updated info');
        } catch (error) {
            setMessage('an error occurred');
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
                            placeholder='latitude, longitude'
                            className={inputStyles}
                            value={`${formData.location}`}
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

export default UpdateUserProfile;
