"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../redux/userSlice';
import { selectAuthStatus } from '../redux/authSlice';
import Header from './Header';
import withAuth from './authHOC';
import Overlay from './overlayContainer';
import { getDonationRequest } from '../api/donation';
import DonationCard from './donationCard';

interface DonationRequestData {
    id: number;
    bloodType: string;
    quantity: number;
    isFulfilled: boolean;
    created_at: Date;
    updated_at: Date;
    location: string;
}

const Dashboard: React.FC = () => {

    const auth = useSelector(selectAuthStatus);
    const user = useSelector((state: any) => state.user.data);
    const [requestList, setRequestList] = useState<any>([]);
    const [loadingRequest, setLoadingRequest] = useState('loading');
    const [userData, setUserData] = useState<any>(user);
    const [showOverlay, setShowOverlay] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCurrentUser() as any);
        setUserData(userData);

    }, [dispatch, userData]);

    useEffect(() => {
        const fetchDonationReqeusts = async () => {
            try {
                const data = await getDonationRequest();
                console.log(data);
                setRequestList(data.donationRequests);
                setLoadingRequest('success');
            } catch (error: any) {
                setLoadingRequest('failed');
                console.log("Error occurred while fetching donation requests: ", error.message)
            }
        }
        fetchDonationReqeusts();
    }, [])

    const handleDisplayOverlay = () => {
        setShowOverlay(!showOverlay);
        const bodyElem = document.querySelector('body');
        if (showOverlay) {
            bodyElem?.classList.add('overflow-hidden');
        } else {
            bodyElem?.classList.remove('overflow-hidden');
        }
    }

    return (
        <>
            <Header isLoggedin={auth} />
            {showOverlay && <Overlay closeOverlay={setShowOverlay} />}
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Blood Donation Requests</h2>
                    {user?.isDonor && (
                        <button onClick={handleDisplayOverlay} className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded">
                            + request donation
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {
                        requestList.map((data: DonationRequestData) =>
                            <DonationCard
                                key={data.id}
                                id={data.id}
                                bloodType={data.bloodType}
                                quantity={data.quantity}
                                isFulfilled={data.isFulfilled}
                                created_at={data.created_at}
                                updated_at={data.updated_at}
                                location={data.location}
                            />
                        )
                    }
                </div>

                <div className="bg-gray-200 h-[600px] my-10 p-4 rounded">
                    <h1 className="mt-20 text-5xl text-center text-gray-400 font-bold">say something</h1>
                </div>
            </div>
        </>
    );
};

export default withAuth(Dashboard);