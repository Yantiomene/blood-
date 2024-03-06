import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile as updateProfile, selectUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { DASHBOARDROUTE } from '../api';
// layouts
import withCurrentUser from '../layouts/withCurrentUser';


const inputStyles = "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
const editStyles = "bg-blue-500 text-white rounded-md px-2 py-1 focus:outline-none focus:bg-blue-600"
const fieldStyles = "mb-4 flex items-center gap-4"
const labelStyles = "block mb-1"
const messageStyles = "text-center mt-4 text-gray-600 italic"

const UpdateUserProfile = () => {
    const [Message, setMessage] = useState('');
    const user = useSelector(selectUser);
    const [formData, setFormData] = useState(user);
    const [isLoading, setLoading] = useState(false);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        if (name === 'longitude') {
            console.log("longitude, value", name, value);
            setFormData({ ...formData, location: [value, formData.location[1]] });
        } else if (name === 'latitude') {
            console.log("latitude, value", name, value);
            setFormData({ ...formData, location: [formData.location[0], value] });
        }
    };

    const handleEditField = (fieldName) => {
        setEditableFields({ ...editableFields, [fieldName]: true });
    };

    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        try {
            dispatch(updateProfile(formData));
            router(DASHBOARDROUTE);
            setMessage('successfully updated info');
        } catch (error) {
            setMessage('an error occurred');
        }
        setLoading(false);
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

                <div className='mb-4'>
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
                    <label className={labelStyles}>Location <p className='text-xs'>(longitude, latitude)</p></label>
                    <div className="flex gap-2 items-center justify-between">
                        {/* <label className={labelStyles}>Longitude</label> */}
                        <input
                            type="number"
                            name="longitude"
                            onChange={handleLocationChange}
                            placeholder='longitude'
                            className={inputStyles}
                            value={`${formData.location[0]}`}
                            disabled={!editableFields.location}
                        />
                        {/* <label className={labelStyles}>Latitude</label> */}
                        <input
                            type="number"
                            name="latitude"
                            onChange={handleLocationChange}
                            placeholder='latitude'
                            className={inputStyles}
                            value={`${formData.location[1]}`}
                            disabled={!editableFields.location}
                        />
                    </div>
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
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Update'}
                </button>
            </form>
        </>
    );
};

export default withCurrentUser(UpdateUserProfile);
