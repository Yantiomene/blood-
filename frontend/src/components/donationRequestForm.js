import React, { useState } from 'react';
import { makeDonationRequest } from '../api/donation';


const inputStyles = "appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline";
const fieldStyles = "mb-4 flex items-center gap-4"
const labelStyles = "block text-slate-700 text-sm font-bold mb-2"
const buttonStyles = "inline-block w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"

const DonationRequestForm = () => {
    const [formData, setFormData] = useState({
        bloodType: 'A+',
        quantity: 10.0,
        location: [0, 0],
        message: '',
    })
    const [requestError, setRequestError] = useState('');
    const [requestSuccess, setRequestSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    const handleLocationChange = (e) => {
        const { value } = e.target;
        const [longitude, latitude] = value.split(',').map(parseFloat);
        setFormData({ ...formData, location: [longitude, latitude] });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await makeDonationRequest(formData);
            setRequestError('');
            setRequestSuccess(response.message);
            
        } catch (error) {
            setRequestSuccess('');
            setRequestError('Invalid Donation Request Format');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="w-[90vw] md:w-[40vw] h-fit bg-white px-8 py-8 mb-4">
                {requestError && <p className="text-red-500 mb-4">{requestError}</p>}
                {requestError && <p className="text-green-500 mb-4">{requestSuccess}</p>}
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
                    <label className={labelStyles}>Location</label>
                    <input
                        id="location"
                        type="text"
                        name="location"
                        onChange={handleLocationChange}
                        className={inputStyles}
                        placeholder='latitude, longitude'
                        required={true}
                    />
                </div>

                <div className={fieldStyles}>
                    <label className={labelStyles}>Message</label>
                    <textarea
                        id="message"
                        name="message"
                        onChange={handleChange}
                        className={inputStyles}
                        placeholder='touch the heart of your donors. start writing...'
                    ></textarea>
                </div>

                <div className="">
                    <button
                        className={buttonStyles + `${requestSuccess? ' bg-green-500': ' bg-red-500 hover:bg-red-700'}`}
                        type="submit"
                        disabled={requestSuccess !== ''}
                    >{requestSuccess? 'Successful': 'Publish Request'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default DonationRequestForm;
