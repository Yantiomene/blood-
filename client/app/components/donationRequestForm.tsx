"use client";

import React, { useState, useEffect } from 'react';
import { makeDonationRequest } from '../api/donation';
import { useSelector } from 'react-redux';
import { geocode } from '../api/user';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

interface DonationRequest {
    bloodType: string;
    quantity: number;
    location: [number, number];
    message: string;
}

const inputStyles = "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
const fieldStyles = "mb-4 flex items-center gap-4"
const labelStyles = "block text-gray-700 text-sm font-bold mb-2"
const buttonStyles = "inline-block w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"

const DonationRequestForm: React.FC = () => {
    const [formData, setFormData] = useState<DonationRequest>({
        bloodType: '',
        quantity: 0.0,
        location: [0, 0],
        message: ''
    })
    const user = useSelector((state: any) => state.user.data);
    const [addressInput, setAddressInput] = useState<string>('');
    const [contactNumber, setContactNumber] = useState<string>('');
    const [phoneCountry, setPhoneCountry] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');
    const [isLocating, setIsLocating] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [quantityError, setQuantityError] = useState<string>("");
    const [requestError, setRequestError] = useState('');
    const [requestSuccess, setRequestSuccess] = useState('');

    useEffect(() => {
        // Pre-fill phone country from profile contact if available
        try {
            const pn = parsePhoneNumberFromString(user?.contactNumber || '');
            if (pn?.country && !phoneCountry) setPhoneCountry(pn.country as string);
            if (user?.contactNumber) setContactNumber(user.contactNumber);
        } catch {}
        // Pre-fill address from profile if available
        if (user?.address && !addressInput) {
            setAddressInput(user.address);
        }
    }, [user?.contactNumber, user?.address, phoneCountry, addressInput]);

    const inputStyles = "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
    const fieldStyles = "mb-4 flex items-center gap-4";
    const labelStyles = "block text-gray-700 text-sm font-bold mb-2";
    const buttonStyles = "inline-block w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline";

    const validateQuantity = (val: any): string => {
        const qty = Number(val);
        if (!Number.isFinite(qty)) return "Quantity must be a number in ml.";
        if (!Number.isInteger(qty)) return "Quantity must be an integer in ml.";
        if (qty < 500) return "Quantity must be at least 500 ml.";
        if (qty > 5000) return "Quantity must not exceed 5000 ml.";
        return "";
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const next: any = { ...formData, [name]: name === 'quantity' ? Number(value) : value };
        setFormData(next);
        if (name === 'quantity') setQuantityError(validateQuantity(value));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddressInput(e.target.value);
    };

    const parseCoordString = (value: string): [number, number] | null => {
        const parts = value.split(',').map(v => parseFloat(v.trim()));
        if (parts.length === 2 && parts.every(n => !isNaN(n))) {
            const [lat, lon] = parts; // expect input as "latitude, longitude"
            return [lon, lat]; // backend expects [lon, lat]
        }
        return null;
    };

    const useMyLocation = async () => {
        try {
            setIsLocating(true);
            setRequestError('');
            await new Promise<void>((resolve, reject) => {
                if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const { latitude, longitude } = pos.coords;
                        setFormData(prev => ({ ...prev, location: [longitude, latitude] }));
                        resolve();
                    },
                    (err) => reject(err),
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            });
        } catch (e: any) {
            setRequestError(e?.message || 'Failed to fetch current location');
        } finally {
            setIsLocating(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setRequestError('');
        setRequestSuccess('');
        setPhoneError('');
        // client-side quantity validation aligned with backend
        const qtyErr = validateQuantity(formData.quantity);
        if (qtyErr) {
            setQuantityError(qtyErr);
            setRequestError(qtyErr);
            return;
        }
        try {
            // Validate basic fields
            if (!formData.bloodType) {
                setRequestError('Blood type is required');
                return;
            }
            if (!formData.quantity || Number(formData.quantity) <= 0) {
                setRequestError('Quantity must be greater than 0');
                return;
            }

            // Resolve location: accept either coordinates input or address geocoding
            let finalLocation: [number, number] | null = null;
            if (Array.isArray(formData.location) && formData.location[0] !== 0 && formData.location[1] !== 0) {
                finalLocation = formData.location;
            } else if (addressInput) {
                const parsed = parseCoordString(addressInput);
                if (parsed) {
                    finalLocation = parsed;
                } else {
                    setIsGeocoding(true);
                    const geo = await geocode(addressInput);
                    setIsGeocoding(false);
                    if (geo.success && geo.location) {
                        finalLocation = geo.location; // [lon, lat]
                    } else {
                        setRequestError(geo.error || 'Could not resolve address to coordinates. Please try a different address or use your current location.');
                        return;
                    }
                }
            }

            if (!finalLocation) {
                setRequestError('Location is required. Enter an address name or coordinates, or click "Use my location".');
                return;
            }

            // Validate and format contact number per selected country
            let formattedContact = (contactNumber || '').trim();
            if (formattedContact) {
                let pn;
                try {
                    pn = phoneCountry ? parsePhoneNumberFromString(formattedContact, { defaultCountry: phoneCountry as any }) : parsePhoneNumberFromString(formattedContact);
                } catch {}
                if (!pn || !pn.isValid()) {
                    setPhoneError('Invalid phone number for the selected country.');
                    setRequestError('Please enter a valid phone number.');
                    return;
                }
                formattedContact = pn.format('E.164');
            }

            // Ensure message provided
            const baseMessage = (formData.message || '').trim();
            if (!baseMessage) {
                setRequestError('Message is required. Please describe your need or context.');
                return;
            }
            const messageWithContact = formattedContact ? `${baseMessage}\nContact: ${formattedContact}` : baseMessage;

            const payload: DonationRequest = {
                bloodType: formData.bloodType,
                quantity: Number(formData.quantity),
                location: finalLocation,
                message: messageWithContact,
            };

            const response = await makeDonationRequest(payload as any);
            setRequestSuccess(response.message || 'Donation request published successfully');
        } catch (error: any) {
            setRequestError(error?.response?.data?.error || 'Invalid Donation Request Format');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="w-[92vw] max-w-[640px] md:w-[40vw] h-fit bg-white shadow-md rounded px-6 sm:px-8 py-6 sm:py-8 mb-4">
                {requestError && <p className="text-red-500 mb-4">{requestError}</p>}
                {requestSuccess && <p className="text-green-500 mb-4">{requestSuccess}</p>}
                <div className={fieldStyles}>
                    <label className={labelStyles}>Blood Type:</label>
                    <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className={inputStyles}
                        aria-describedby="bloodTypeHelpText"
                    >
                        <option value="">Select blood type</option>
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
                    <label className={labelStyles} htmlFor="quantity">Quantity (ml):</label>
                    <input
                        className={inputStyles}
                        id="quantity"
                        type="number"
                        name='quantity'
                        value={formData.quantity}
                        placeholder="Enter your quantity in ml"
                        onChange={handleChange}
                        min={500}
                        max={5000}
                        step={50}
                        required
                    />
                    {quantityError && <p className="text-red-500 text-xs mt-1">{quantityError}</p>}
                </div>

                <div className={fieldStyles}>
                    <label className={labelStyles}>Message</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={`${inputStyles} min-h-[96px]`}
                        placeholder='Describe your request (hospital, urgency, etc.)'
                    />
                </div>

                <div className={fieldStyles}>
                    <label className={labelStyles}>Address or Coordinates</label>
                    <input
                        id="addressOrCoords"
                        type="text"
                        name="addressOrCoords"
                        value={addressInput}
                        onChange={handleAddressChange}
                        className={inputStyles}
                        placeholder={user?.address ? `Current: ${user.address} (or enter latitude, longitude)` : 'Enter address name (e.g., Nairobi CBD) or latitude, longitude'}
                    />
                </div>

                <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <button
                        type="button"
                        onClick={useMyLocation}
                        className="bg-gray-700 text-white rounded-md px-3 py-2 disabled:opacity-60"
                        disabled={isLocating || isGeocoding}
                    >
                        {isLocating ? 'Fetching location…' : (isGeocoding ? 'Resolving address…' : 'Use my location')}
                    </button>
                    <p className="text-xs text-gray-500">Enter a known place or coordinates (lat, lon). We’ll geocode addresses automatically.</p>
                </div>

                <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="sm:col-span-1">
                        <label className={labelStyles}>Phone Country</label>
                        <select
                            id="phoneCountry"
                            name="phoneCountry"
                            value={phoneCountry}
                            onChange={(e) => setPhoneCountry(e.target.value)}
                            className={inputStyles}
                        >
                            <option value="">Select country</option>
                            <option value="US">United States (+1)</option>
                            <option value="NG">Nigeria (+234)</option>
                            <option value="GH">Ghana (+233)</option>
                            <option value="KE">Kenya (+254)</option>
                            <option value="ZA">South Africa (+27)</option>
                            <option value="CM">Cameroon (+237)</option>
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label className={labelStyles}>Contact Number</label>
                        <input
                            id="contactNumber"
                            type="tel"
                            name="contactNumber"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            className={inputStyles}
                            placeholder="Enter your phone number"
                        />
                        {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                    </div>
                </div>

                <button type="submit" className={`${buttonStyles} bg-blue-500 hover:bg-blue-700`}>Submit</button>
            </form>
        </>
    )
}

export default DonationRequestForm;