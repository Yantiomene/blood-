"use client";

import React from 'react';

interface DonationRequestData {
    id: number;
    bloodType: string;
    quantity: number;
    isFulfilled: boolean;
    created_at: Date;
    updated_at: Date;
    location: string;
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
        location
    }: DonationRequestData = props

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
            <p>status: <span className='px-2 py-1 italic text-sm rounded-lg bg-yellow-200'>{isFulfilled ? 'donation received' : 'awaiting donors'}</span></p>
        </div>
    )
}

export default DonationCard;