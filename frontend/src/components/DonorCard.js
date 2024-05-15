import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { calculateTimeDelta } from "../util/datetime";
import { getDonationRequestByUserId, deleteDonationRequest, updateDonationRequest } from "../api/donation";
import { showMessage } from "../redux/globalComponentSlice";
import Overlay from '../layouts/overlayContainer';


const menuButtonStyle = "card__action-btn p-1 w-8 h-8 cursor-pointer border rounded-full text-sm flex items-center justify-around";

const DonationCard = (props) => {

    const dispatch = useDispatch();
    const [showDeleteMenu, setShowDeleteMenu] = useState(false);
    const [showUpdateMenu, setShowUpdateMenu] = useState(false);
    // view card details
    const handleViewCard = async (cardId) => {
        const cardDetail = await getDonationRequestByUserId(cardId);
        console.log("card clicked", cardDetail);
    }

    // delete card
    const handleDeleteCard = async (cardId) => {
        try {
            const response = await deleteDonationRequest(cardId);
            if (response.success) {
                setShowDeleteMenu(false);
                dispatch(showMessage({ heading: 'Success', text: `${response.messasge}` }));
            }
        } catch (error) {
            dispatch(showMessage({ heading: 'Error', text: `${error}` }));
        }
    }

    // update card
    const handleUpdateCard = async (cardId) => {
        try {
            const response = await updateDonationRequest(cardId); // will upate later to use same as create request form
            if (response.success) {
                showMessage({ heading: 'Success', text: 'Request updated' });
            }
        }
        catch (error) {
            showMessage({ heading: 'Error', text: `${error.error}` });
        }
    }

    useEffect(()=>{
        if (showDeleteMenu === false || showUpdateMenu === false) {
            document.body.style.overflow = 'auto';
        }
    }, [showDeleteMenu, showUpdateMenu])

    const {
        id,
        bloodType,
        quantity,
        created_at,
        updated_at,
        userId,
        message,
        location,
        isFulfilled, // not yet
        viewsCount, // not yet
        urgent, // not yet
        editable = false,
    } = props;

    return (
        <>
            <div
                className="card flex flex-col lg:max-w-96 h-48 p-4 bg-white transition-all duration-100 hover:shadow-md hover:border-red-100 outline outline-transparent active:outline-red-100 rounded-lg"
            >
                <div className="card__top flex items-center justify-between">
                    <div className="top-left flex items-center gap-2 cursor-pointer group"
                        onClick={() => handleViewCard(id)}
                    >
                        <div
                            className="card__icon w-8 h-8 p-1 text-white text-center text-sm bg-red-600 border-l-4 border-l-red-800 transform -rotate-45"
                            style={{ borderRadius: "1000px 0px 1000px 1000px" }}
                        >
                            <h2 className="icon-text">{bloodType}</h2>
                        </div>
                        <div className='leading-none'>
                            <small><span className="my-1 px-1 rounded bg-slate-200">User {userId}</span> is requesting</small>
                            <h1 className="card__title text-2xl font-bold group-hover:text-red-400">{quantity}ml of {bloodType}</h1>
                        </div>
                    </div>
                    {
                        editable &&
                        <div className="top-right flex items-center gap-2">
                            <span
                                className={menuButtonStyle + " active:border-blue-300 hover:bg-blue-100 text-blue-400"}
                                onClick={() => setShowUpdateMenu(true)}
                            >E</span>
                            <span
                                className={menuButtonStyle + " active:border-red-300 hover:bg-red-100 text-red-400"}
                                onClick={() => setShowDeleteMenu(true)}
                            >X</span>
                        </div>
                    }
                    {
                        showDeleteMenu ?
                            <Overlay showWindow={setShowDeleteMenu}>
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
                                            onClick={() => setShowDeleteMenu(false)}
                                        >Cancel</button>
                                    </div>
                                </div>
                            </Overlay>
                            :
                            showUpdateMenu ?
                                <Overlay showWindow={setShowUpdateMenu}>
                                    <div className='p-4 md:w-[30vw] bg-white'>
                                        <h2 className='text-2xl text-blue-400 mb-2'>Update request for <b>{quantity}ml of {bloodType}</b></h2>
                                        <p className='leading-4 mb-4'>
                                            update the request details
                                        </p>
                                        <div className='flex gap-2 flex-row-reverse'>
                                            <button
                                                className='px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg'
                                                onClick={() => handleUpdateCard(id)}
                                            >Update</button>
                                            <button
                                                className='px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-500 rounded-lg'
                                                onClick={() => setShowUpdateMenu(false)}
                                            >Cancel</button>
                                        </div>
                                    </div>
                                </Overlay>
                                : null
                    }
                </div>
                <div className="card__middle">
                    {
                        message &&
                        <p className="card__text bg-slate-100 text-slate-500 truncate py-1 px-2 my-4 text-sm rounded">
                            {message}
                        </p>
                    }
                </div>
                <div className="card__foot flex items-end justify-between mt-auto border-t border-t-slate-100">
                    <div className="bottom-left">
                        <div className="card__location flex items-center gap-1">
                            <span className="icon-location w-4 h-4 bg-blue-500 border-2 border-blue-200 rounded-full"></span>
                            <p>Ghana</p>
                        </div>
                        <div className="card__date text-xs text-slate-400 flex gap-2">
                            { created_at && <p>Requested {calculateTimeDelta(created_at)}</p> }
                            {
                                updated_at && (updated_at !== created_at) &&
                                <>
                                    <p>•</p>
                                    <p>Updated {calculateTimeDelta(updated_at)}</p>
                                </>
                            }
                        </div>
                    </div>
                    <small className="card__status bg-yellow-100 border border-yellow-300 text-yellow-600 px-2 rounded-full">pending</small>
                </div>
            </div>

        </>
    )
}

export default DonationCard;
