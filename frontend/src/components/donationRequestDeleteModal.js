import React from 'react';
import { deleteRequest } from '../redux/donationSlice';
import { useDispatch } from 'react-redux';
import { showMessage } from '../redux/globalComponentSlice';

export const DeleteDonationRequestModal = ({ donationRequest, closeModal }) => {
    const { id, bloodType, quantity } = donationRequest;

    const dispatch = useDispatch();
    const handleDeleteCard = (cardId) => {
        try {
            dispatch(deleteRequest(cardId));
            closeModal(false);
            dispatch(showMessage({ heading: 'Success', text: `Deleted Successfully` }));
        } catch (error) {
            dispatch(showMessage({ heading: 'Error', text: `${error}` }));
        }
    }

    return (
        <div className='p-4 md:w-[30vw] bg-white'>
            <h2 className='text-2xl text-red-400 mb-2'>Delete request for <b>{quantity}ml of {bloodType}</b></h2>
            <p className='leading-4 mb-4'>
                Are you sure you want to delete this request?
            </p>
            <div className='flex gap-2 flex-row-reverse'>
                <button
                    className='px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg'
                    onClick={() => handleDeleteCard(id)}
                >Confirm</button>
                <button
                    className='px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-500 rounded-lg'
                    onClick={() => closeModal(false)}
                >Cancel</button>
            </div>
        </div>
    )
}