"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import withAuth from '../components/authHOC';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, updateUserProfile } from '../redux/userSlice';
import { useRouter } from 'next/navigation';
import { geocode as geocodeAPI, getCurrentUser as getCurrentUserAPI } from '../api/user';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';

interface UserData {
    username: string;
    email: string;
    bloodType: string;
    isDonor: boolean;
    // Address typed by user; converted via backend geocode to [lon, lat]
    address: string;
    // Keep computed location in memory for submit
    location: string; // "lon, lat"
    // Display-only: formatted address for current coordinates
    currentAddress?: string;
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
        address: '',
        location: locStr,
        currentAddress: user?.address || '',
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
        address: false,
        location: false,
         contactNumber: false
     });
     const [isLocating, setIsLocating] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [phoneCountry, setPhoneCountry] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');

     const router = useRouter();
     const dispatch = useDispatch<any>();

     // Fetch current user on mount
     useEffect(() => {
         dispatch(fetchCurrentUser());
     }, [dispatch]);

     // When user in store changes, sync into form
     useEffect(() => {
         setFormData(normalizeUserToForm(user));
         // Try to infer phone country from existing E.164 number
         try {
           const pn = parsePhoneNumberFromString(user?.contactNumber || '');
          if (pn?.country) setPhoneCountry(prev => prev || pn.country || '');
         } catch {}
     }, [user]);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
         const { name, value } = e.target;
         setFormData(prev => ({ ...prev, [name]: value }));
         if (name === 'contactNumber') setPhoneError('');
     };

     const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
         const { name, checked } = e.target;
         setFormData(prev => ({ ...prev, [name]: checked }));
         if (name === 'isDonor') {
             setMessage(
                 checked
                     ? 'Donor status enabled. You may be discoverable to recipients based on your blood type and location.'
                     : 'Donor status disabled. You will not be shown in donor searches.'
             );
         }
     };

     const handleEditField = (fieldName: keyof UserData) => {
         setEditableFields(prev => ({ ...prev, [fieldName]: true }));
     };

     const useMyLocation = async () => {
         if (!navigator.geolocation) {
             setMessage('Geolocation is not supported by your browser.');
             return;
         }
         setMessage('Requesting location permission...');
         try {
             // Pre-check permission where supported to provide clearer guidance
                          const navAny: any = navigator as any;
             if (navAny.permissions && typeof navAny.permissions.query === 'function') {
                 try {
                     const status = await navAny.permissions.query({ name: 'geolocation' as PermissionName });
                     if (status.state === 'denied') {
                         setMessage('Location access is denied. Please enable location permissions in your browser settings and try again.');
                         return;
                     }
                 } catch {
                     // Ignore permission API errors and proceed with geolocation request
                 }
             }
             setIsLocating(true);
             navigator.geolocation.getCurrentPosition(
                 (pos) => {
                     const { latitude, longitude } = pos.coords;
                    setFormData(prev => ({ ...prev, location: `${longitude}, ${latitude}` }));
                    setEditableFields(prev => ({ ...prev, location: true }));
                    setMessage('Location captured. Coordinates filled. The formatted address will be added after you submit.');
                    setIsLocating(false);
                 },
                 (err) => {
                     console.error('Geolocation error:', err);
                    setMessage('Unable to fetch your location. Please allow location access and try again, or enter an address.');
                    setIsLocating(false);
                 },
                 { enableHighAccuracy: true, timeout: 10000 }
             );
         } catch (e) {
             setMessage('Unable to start location request.');
         }
     };

    // Geocoding is now performed during submit inside handleSubmit; geocodeAddress helper removed.

     const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
         event.preventDefault();
         setMessage('');
         setPhoneError('');
         try {
             let parsed = parseLocation(formData.location);
             // If coordinates are not set, try geocoding the provided address on submit
             if (!parsed && formData.address && formData.address.trim()) {
                 try {
                     setIsGeocoding(true);
                     const resp = await geocodeAPI(formData.address.trim());
                     if (resp?.success && resp?.location) {
                         const [lon, lat] = resp.location;
                         parsed = [lon, lat];
                         setFormData(prev => ({ ...prev, location: `${lon}, ${lat}`, currentAddress: resp.address || prev.currentAddress }));
                         setEditableFields(prev => ({ ...prev, location: true }));
                     } else {
                         setMessage(resp?.error || 'Could not geocode that address. Please check and try again.');
                         return;
                     }
                 } finally {
                     setIsGeocoding(false);
                 }
             }
             // Allow updates without address if the user already has one stored
             const hasExistingAddressOrCoords = !!(user?.address || formData.currentAddress || parseLocation(formData.location) || (Array.isArray(user?.location) && user.location.length === 2));
             if (!parsed && !hasExistingAddressOrCoords) {
                 setMessage('Please click "Use my location" or provide an address. Location is required only if you have not set any address yet.');
                 return;
             }

             // Validate and format contact number per selected country
             let formattedContact = (formData.contactNumber || '').trim();
             if (formattedContact) {
               let pn;
               try {
                 pn = phoneCountry ? parsePhoneNumberFromString(formattedContact, { defaultCountry: phoneCountry as CountryCode }) : parsePhoneNumberFromString(formattedContact);
               } catch {}
               if (!pn || !pn.isValid()) {
                 setPhoneError('Invalid phone number for the selected country. Please check and try again.');
                 setMessage('Please enter a valid phone number for the selected country.');
                 return;
               }
               formattedContact = pn.format('E.164');
             }

             const payload: any = {
                 username: formData.username,
                 email: formData.email,
                 bloodType: formData.bloodType,
                 isDonor: formData.isDonor,
                 contactNumber: formattedContact,
             };
             if (parsed) {
                 payload.location = parsed; // [lon, lat]
             }

             // Dispatch thunk and check for rejection manually to avoid TS unwrap issues
             const resultAction = await (dispatch((updateUserProfile as any)(payload)) as any);
             if ((resultAction as any)?.error) {
                 throw (resultAction as any).error;
             }
             // Refresh user profile
             await (dispatch(fetchCurrentUser()) as any);
             // Rehydrate full form state from the latest API response to ensure consistency across all fields
             try {
               const refreshed = await getCurrentUserAPI();
               const latest = refreshed?.user || refreshed;
               setFormData(normalizeUserToForm(latest));
             } catch {}
             setMessage(`Profile updated successfully. Donor status: ${formData.isDonor ? 'Enabled' : 'Disabled'}. ${formData.isDonor ? 'Recipients may contact you based on your blood type and location.' : 'You will not be shown to recipients.'} ${formData.currentAddress ? `Address: ${formData.currentAddress}` : ''}`.trim());
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
                 <div className="mb-4 p-4 bg-gray-50 rounded border">
                   <p className="text-sm text-gray-700"><span className="font-medium">Current Address:</span> {user?.address || formData.currentAddress || 'Not available yet'}</p>
                   <p className="text-sm text-gray-700"><span className="font-medium">Contact Number:</span> {user?.contactNumber || formData.contactNumber || 'Not set'}</p>
                 </div>
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
                 <div className={fieldStyles}>
                     <label className={labelStyles}>Donor status</label>
                     <input
                        type="checkbox"
                        name="isDonor"
                        checked={formData.isDonor}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5"
                        disabled={!editableFields.isDonor}
                     />
                     {!editableFields.isDonor && (
                         <button
                             type="button"
                             onClick={() => handleEditField('isDonor')}
                             className={editStyles}
                         >
                             Edit
                         </button>
                     )}
                 </div>
                 <div className="mb-4 flex flex-col gap-4">
                    <div className={fieldStyles}>
                        <label className={labelStyles}>Address</label>
                        <input
                            type="text"
                            name="address"
                            onChange={handleChange}
                            placeholder={formData.currentAddress ? `Current: ${formData.currentAddress}` : 'Enter an address or place (e.g., "KICC Nairobi" or "221B Baker Street")'}
                            className={inputStyles}
                            value={formData.address}
                            disabled={!editableFields.address}
                        />
                        {!editableFields.address && (
                            <button
                                type="button"
                                onClick={() => handleEditField('address')}
                                className={editStyles}
                            >
                                Edit
                            </button>
                        )}
                    </div>

                     {/* Removed manual lat/lon editing UI; show display-only current address and coordinates */}
                     {/* Display-only coordinates; address is shown in the summary above to avoid duplication */}
                     <p className="text-sm text-gray-500 px-1">
                         {formData.location ? `Coordinates: ${formData.location}` : 'Coordinates will be filled after geocoding or using your location.'}
                     </p>
                 </div>

                 <div className="mb-4 flex items-center gap-4">
                     <button
                         type="button"
                         onClick={useMyLocation}
                         className="bg-gray-700 text-white rounded-md px-3 py-2 disabled:opacity-60"
                         disabled={isLocating || isGeocoding}
                     >
                         {isLocating ? 'Fetching location…' : 'Use my location'}
                     </button>
                 </div>

                 <div className={fieldStyles}>
                     <label className={labelStyles}>Contact Number</label>
                     <select
                       name="phoneCountry"
                       value={phoneCountry}
                       onChange={(e) => setPhoneCountry(e.target.value)}
                       className={inputStyles}
                       disabled={!editableFields.contactNumber}
                     >
                       <option value="">Select country</option>
                       <option value="KE">Kenya (+254)</option>
                       <option value="NG">Nigeria (+234)</option>
                       <option value="UG">Uganda (+256)</option>
                       <option value="TZ">Tanzania (+255)</option>
                       <option value="RW">Rwanda (+250)</option>
                       <option value="ET">Ethiopia (+251)</option>
                       <option value="GH">Ghana (+233)</option>
                       <option value="ZA">South Africa (+27)</option>
                       <option value="CM">Cameroon (+237)</option>
                       <option value="SN">Senegal (+221)</option>
                       <option value="DZ">Algeria (+213)</option>
                       <option value="MA">Morocco (+212)</option>
                       <option value="EG">Egypt (+20)</option>
                     </select>
                     <input
                         type="text"
                         name="contactNumber"
                         value={formData.contactNumber}
                         onChange={handleChange}
                         className={inputStyles}
                         disabled={!editableFields.contactNumber}
                         placeholder={phoneCountry ? `Enter number for ${phoneCountry}` : 'Enter phone number'}
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
                 {phoneError && <p className="text-sm text-red-600 px-1">{phoneError}</p>}

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
