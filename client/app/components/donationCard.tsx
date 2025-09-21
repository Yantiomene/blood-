"use client";

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { acceptRequest } from '../api/donation';

interface DonationRequestData {
    id: number;
    bloodType: string;
    quantity: number;
    isFulfilled: boolean;
    created_at: Date;
    updated_at: Date;
    location: string;
    userId?: number;
}

const convertDateTime = (dateStr: Date) => {
    const date = new Date(dateStr).toDateString();
    const time = new Date(dateStr).toLocaleTimeString();
    return `${date} at ${time}`;
}

const DonationCard = (props: DonationRequestData) => {

    const {
        id,
        bloodType,
        quantity,
        isFulfilled,
        created_at,
        updated_at,
        location,
        userId,
    }: DonationRequestData = props

    const currentUser = useSelector((state: any) => state.user?.data || {});
    const isDonor = !!currentUser?.isDonor;
    const isOwn = typeof userId === 'number' && currentUser?.id === userId;

    const [accepting, setAccepting] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [acceptMsg, setAcceptMsg] = useState<string>("");

    const canAccept = isDonor && !isFulfilled && !isOwn;

    const onAccept = async () => {
        try {
            setAccepting(true);
            setAcceptMsg("");
            await acceptRequest(id);
            setAccepted(true);
            setAcceptMsg('You accepted this request. The requester has been notified via email.');
        } catch (e: any) {
            const msg = e?.response?.data?.message || e?.message || 'Failed to accept request.';
            setAcceptMsg(msg);
        } finally {
            setAccepting(false);
        }
    };

    return (
        <div
            className={`"bg-white p-4 shadow rounded " ${isFulfilled ? 'bg-green-200' : 'bg-white'}`}
        >
            <h3 className='text-lg font-bold mb-2'>
                Request for <span>{quantity}</span> ml of <span className='bg-red-500 p-2 text-white text-sm' style={{ borderRadius: "100px 0 100px 100px" }}>{bloodType}</span>
            </h3>
            <p>Requested on <span>{convertDateTime(created_at)}</span></p>
            <p>Updated on <span>{convertDateTime(updated_at)}</span></p>
            {/* <p>Zone: {location}</p> */}
            <p><span className='px-2 py-1 text-xs rounded-lg bg-yellow-200'>{isFulfilled ? 'donation received' : 'awaiting donors'}</span></p>

            {canAccept && (
                <div className="mt-3">
                    <button
                        onClick={onAccept}
                        disabled={accepting || accepted}
                        className={`px-3 py-2 rounded text-white ${accepted ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-60`}
                    >
                        {accepted ? 'Accepted' : (accepting ? 'Accepting…' : 'Accept request')}
                    </button>
                    {acceptMsg && (
                        <p className="text-sm mt-2 text-gray-700">{acceptMsg}</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default DonationCard;