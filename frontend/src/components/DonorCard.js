import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculateTimeDelta } from "../util/datetime";
import { getDonationRequestByUserId } from "../api/donation";

import Overlay from '../layouts/overlayContainer';
import DonationRequestForm from './donationRequestForm';
import { selectUser } from '../redux/userSlice';
import { DeleteDonationRequestModal } from './donationRequestDeleteModal';


const menuButtonStyle = "card__action-btn p-1 w-8 h-8 cursor-pointer border rounded-full text-sm flex items-center justify-around";

const DonationCard = (props) => {

    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const [showDeleteMenu, setShowDeleteMenu] = useState(false);
    const [showUpdateMenu, setShowUpdateMenu] = useState(false);

    // view card details
    const handleViewCard = async (cardId) => {
        const cardDetail = await getDonationRequestByUserId(cardId);
        console.log("card clicked", cardDetail);
    }

    useEffect(() => {
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
        // location,
        // isFulfilled, // not yet
        // viewsCount, // not yet
        // urgent, // not yet
        editable = user.id === userId,
    } = props.data;

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
                                <DeleteDonationRequestModal
                                    donationRequest={props.data}
                                    closeModal={setShowDeleteMenu}
                                />
                            </Overlay>
                            :
                            showUpdateMenu &&
                            <Overlay showWindow={setShowUpdateMenu}>
                                <DonationRequestForm initialFormData={props.data} />
                            </Overlay>
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
                            {created_at && <p>Requested {calculateTimeDelta(created_at)}</p>}
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
