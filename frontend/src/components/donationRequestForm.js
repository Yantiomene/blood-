import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { addDonationRequest, updateRequest } from '../redux/donationSlice';
import { convertGeoToPoint } from '../util/geo';

const inputStyles = "appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline";
const fieldStyles = "mb-4 flex items-center gap-4"
const labelStyles = "block text-slate-700 text-sm font-bold mb-2"
const buttonStyles = "inline-block w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"

const DonationRequestForm = (props = {}) => {
    const initialFormData = props.initialFormData || {};
    const formMode = initialFormData.id ? 'Update' : 'Create';

    const initialLocation = formMode === 'Update' ? convertGeoToPoint(initialFormData.location) : [0, 0];

    const [formData, setFormData] = useState({
        bloodType: initialFormData.bloodType || 'A+',
        quantity: initialFormData.quantity || 10.0,
        latitude: initialLocation[0],
        longitude: initialLocation[1],
        message: initialFormData.message || '',
    });

    const [requestError, setRequestError] = useState('');
    const [requestSuccess, setRequestSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        try {
            const location = [parseFloat(formData.latitude), parseFloat(formData.longitude)];
            const requestData = { ...formData, location };
            if (formMode === 'Update') {
                dispatch(updateRequest({ ...initialFormData, ...requestData }));
            } else {
                dispatch(addDonationRequest(requestData));
            }
            setRequestError('');
            setRequestSuccess(`Donation request ${formMode}d successfully`);
        } catch (error) {
            setRequestSuccess('');
            setRequestError(`${error.message}`);
        }
    };

    useEffect(() => {
        let timer;
        if (requestSuccess) {
            timer = setTimeout(() => {
                setRequestSuccess('');
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [requestSuccess]);

    return (
        <form onSubmit={handleSubmit} className="w-[90vw] md:w-[40vw] h-fit bg-white px-8 py-8 mb-4">

            <h1 className='text-2xl font-bold text-red-500 mb-4'>
                🤗 {formMode === 'Create' ? 'Make a request' : `Update your request for ${initialFormData.quantity} of ${initialFormData.bloodType}`}
            </h1>

            {(requestError || requestSuccess) && (
                <p className={clsx('mb-4 p-2 rounded', {
                    'text-red-500 bg-red-100': requestError,
                    'text-green-500 bg-green-100': !requestError
                })}>
                    {requestError || requestSuccess}
                </p>
            )}

            <div className={fieldStyles}>
                <label className={labelStyles}>
                    Blood Type:
                </label>
                <select
                    id="bloodType"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className={inputStyles}
                    aria-describedby="bloodTypeHelpText"
                    required={true}
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
            </div>

            <div className={fieldStyles}>
                <label className={labelStyles} htmlFor="quantity">
                    quantity:
                </label>
                <input
                    className={inputStyles}
                    id="quantity"
                    type="number"
                    name='quantity'
                    value={formData.quantity}
                    placeholder="Enter your quantity in ml"
                    onChange={handleChange}
                    required={true}
                />
            </div>

            <div className={fieldStyles}>
                <label className={labelStyles}>Location - Latitude</label>
                <input
                    id="latitude"
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder='Enter latitude'
                    required={true}
                />
            </div>

            <div className={fieldStyles}>
                <label className={labelStyles}>Location - Longitude</label>
                <input
                    id="longitude"
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder='Enter longitude'
                    required={true}
                />
            </div>

            <div className={fieldStyles}>
                <label className={labelStyles}>Message</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={inputStyles}
                    required={true}
                    placeholder='Touch the heart of your donors. Start writing...'
                ></textarea>
            </div>

            <div className="">
                <button
                    className={buttonStyles + `${requestSuccess ? ' bg-green-500' : ' bg-red-500 hover:bg-red-700'}`}
                    type="submit"
                    disabled={requestSuccess !== ''}
                >{requestSuccess ? 'Successful' : formMode === 'Update' ? 'Update Request' : 'Publish Request'}
                </button>
            </div>
        </form>
    );
};

export default DonationRequestForm;
