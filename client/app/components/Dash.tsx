"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../redux/userSlice';
import { selectAuthStatus } from '../redux/authSlice';
import Header from './Header';
import withAuth from './authHOC';
import Overlay from './overlayContainer';
import { getDonationRequest } from '../api/donation';
import DonationCard from './donationCard';
import Link from 'next/link';
import { getDonationRequestByUserId } from '../api/donation';

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

const Dashboard: React.FC = () => {

    const auth = useSelector(selectAuthStatus);
    const user = useSelector((state: any) => state.user.data);
    const [requestList, setRequestList] = useState<DonationRequestData[]>([]);
    const [myRequests, setMyRequests] = useState<DonationRequestData[]>([]);
    const [loadingRequest, setLoadingRequest] = useState<'loading' | 'success' | 'failed'>('loading');
    const [showOverlay, setShowOverlay] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCurrentUser() as any);
    }, [dispatch]);

    useEffect(() => {
        const fetchDonationReqeusts = async () => {
            try {
                const data = await getDonationRequest();
                setRequestList(data.donationRequests || []);
                setLoadingRequest('success');
            } catch (error: any) {
                setLoadingRequest('failed');
                console.log("Error occurred while fetching donation requests: ", error.message)
            }
        }
        fetchDonationReqeusts();
    }, [])

    useEffect(() => {
        const fetchMine = async () => {
            if (!user?.id) return;
            try {
                const data = await getDonationRequestByUserId(String(user.id));
                setMyRequests(data.donationRequests || []);
            } catch (e) {
                setMyRequests([]);
            }
        };
        fetchMine();
    }, [user?.id]);

    const awaitingDonorsCount = useMemo(() => {
        return requestList.filter(r => !r.isFulfilled).length;
    }, [requestList]);

    // NOTE: Backend does not persist "accepted" state yet; these will remain 0 until server adds tracking.
    const acceptedCount = 0;
    const acceptedFulfilledCount = 0;
    const acceptedPendingCount = 0;

    const othersRequests = useMemo(() => {
        if (!user?.id) return requestList;
        return requestList.filter(r => r.userId !== user.id);
    }, [requestList, user?.id]);

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
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Dashboard</h2>
                    {user?.isDonor && (
                        <button onClick={handleDisplayOverlay} className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded">
                            + request donation
                        </button>
                    )}
                </div>

                {user?.isDonor ? (
                    <>
                        {/* Donor Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white rounded shadow p-4">
                                <p className="text-sm text-gray-500">Accepted donations</p>
                                <p className="text-3xl font-bold">{acceptedCount}</p>
                            </div>
                            <div className="bg-white rounded shadow p-4">
                                <p className="text-sm text-gray-500">Accepted & fulfilled</p>
                                <p className="text-3xl font-bold">{acceptedFulfilledCount}</p>
                            </div>
                            <div className="bg-white rounded shadow p-4">
                                <p className="text-sm text-gray-500">Accepted & pending</p>
                                <p className="text-3xl font-bold">{acceptedPendingCount}</p>
                            </div>
                            <div className="bg-white rounded shadow p-4">
                                <p className="text-sm text-gray-500">Requests awaiting donors</p>
                                <p className="text-3xl font-bold">{awaitingDonorsCount}</p>
                            </div>
                        </div>

                        {acceptedCount === 0 && (
                            <div className="bg-red-50 border border-red-200 text-red-800 rounded p-4 mb-8">
                                <p className="font-semibold">Your blood can be someone’s second chance.</p>
                                <p className="text-sm mt-1">Take a moment to review nearby requests and say “Yes” today. A life may depend on it.</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Blood Donation Requests</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {loadingRequest === 'success' && requestList.map((data: DonationRequestData) => (
                                <DonationCard
                                    key={data.id}
                                    id={data.id}
                                    bloodType={data.bloodType}
                                    quantity={data.quantity}
                                    isFulfilled={data.isFulfilled}
                                    created_at={data.created_at}
                                    updated_at={data.updated_at}
                                    location={data.location}
                                    userId={data.userId}
                                />
                            ))}
                            {loadingRequest === 'loading' && (
                                <p className="text-gray-500">Loading requests...</p>
                            )}
                            {loadingRequest === 'failed' && (
                                <p className="text-red-500">Failed to load requests.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Non-donor: Show their own requests */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold">Your Requests</h3>
                                {/* Remove Update profile button for non-donor users; Become a donor link exists below */}
                                {/* <Link className="text-sm text-blue-600 hover:underline" href="/profile">Update profile</Link> */}
                            </div>
                            {myRequests.length === 0 ? (
                                <p className="text-gray-500">You haven’t made any requests yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {myRequests.map((data: DonationRequestData) => (
                                        <DonationCard
                                            key={data.id}
                                            id={data.id}
                                            bloodType={data.bloodType}
                                            quantity={data.quantity}
                                            isFulfilled={data.isFulfilled}
                                            created_at={data.created_at}
                                            updated_at={data.updated_at}
                                            location={data.location}
                                            userId={data.userId}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Community requests with CTA to become a donor */}
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold">Community Requests</h3>
                            <Link className="text-sm text-blue-600 hover:underline" href="/profile">Become a donor</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {loadingRequest === 'success' && othersRequests.map((data: DonationRequestData) => (
                                <DonationCard
                                    key={data.id}
                                    id={data.id}
                                    bloodType={data.bloodType}
                                    quantity={data.quantity}
                                    isFulfilled={data.isFulfilled}
                                    created_at={data.created_at}
                                    updated_at={data.updated_at}
                                    location={data.location}
                                    userId={data.userId}
                                />
                            ))}
                            {loadingRequest === 'loading' && (
                                <p className="text-gray-500">Loading requests...</p>
                            )}
                            {loadingRequest === 'failed' && (
                                <p className="text-red-500">Failed to load requests.</p>
                            )}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-8">
                            <p className="font-semibold text-blue-800">Make the switch</p>
                            <p className="text-sm text-blue-700 mt-1">Switch your status to Donor in your profile to help fulfill urgent requests in your area.</p>
                            <Link href="/profile" className="inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Update profile</Link>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default withAuth(Dashboard);