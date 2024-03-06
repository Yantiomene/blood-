"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../redux/userSlice';
import { selectAuthStatus } from '../redux/authSlice';
// import Header from './Header';
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
        console.log("body element", bodyElem);
        if (showOverlay) {
            console.log("body element is showing", showOverlay);
            bodyElem?.classList.add('overflow-hidden');
        } else {
            console.log("body element is closed", showOverlay);
            bodyElem?.classList.remove('overflow-hidden');
        }
    }

    return (
        <>
            {/* <Header isLoggedin={auth} /> */}
            <header className="bg-white sticky top-0 z-40 shadow">
                <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Welcome, {userData?.username}!</h1>
                    {
                        user?.isDonor &&
                        <button
                            onClick={handleDisplayOverlay}
                            className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded">
                            + request donation
                        </button>
                    }
                </nav>
            </header>
            {showOverlay && <Overlay closeOverlay={setShowOverlay} />}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Blood Donation Requests</h2>

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
                    {/* <div className="bg-white p-4 shadow rounded">
                        <h3 className="text-lg font-bold mb-2">Profile</h3>
                        <p>Email: {userData?.email}</p>
                        <p>Username: {userData?.username}</p>
                    </div>

                    <div className="bg-white p-4 shadow rounded">
                        <h3 className="text-lg font-bold mb-2">Blood Requests</h3>
                        <p>Total Orders: 10</p>
                        <p>Pending Orders: 2</p>
                    </div>

                    <div className="bg-white p-4 shadow rounded">
                        <h3 className="text-lg font-bold mb-2">Settings</h3>
                        <p>Notifications: On</p>
                        <p>Language: English</p>
                    </div> */}
                </div>

                <div className="bg-gray-200 h-[600px] my-10 p-4 rounded">
                    <h1 className="mt-20 text-5xl text-center text-gray-400 font-bold">say something</h1>
                </div>
            </div>
        </>
    );
};

export default withAuth(Dashboard);