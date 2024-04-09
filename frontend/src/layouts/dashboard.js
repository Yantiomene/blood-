import React, { useState, useEffect } from 'react';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../redux/userSlice';
import { getDonationRequest, findMatchingDonors } from '../api/donation';
import { displayOverlayContainer } from '../redux/globalComponentSlice';
// layouts
import AuthRequired from './authRequired';
// components
import Overlay from './overlayContainer';
import DonationCard from '../components/DonorCard';
import DonationRequestForm from '../components/donationRequestForm';

const Dashboard = () => {

    const userData = useSelector(selectUser);
    const [requestList, setRequestList] = useState([]);
    const [matchingDonors, setMatchingDonors] = useState([]);

    const dispatch = useDispatch();
    const showOverlay = useSelector((state) => state.globalComponent.displayOverlay);

    useEffect(() => {
        const fetchDonationReqeusts = async () => {
            try {
                const data = await getDonationRequest();
                setRequestList(data.donationRequests);
            } catch (error) {
                console.log("Error occurred while fetching donation requests: ", error.message)
            }
        }
        fetchDonationReqeusts();
    }, [])

    // useEffect(() => {
    //     const fetchMatchingDonors = async () => {
    //         try {
    //             const data = await findMatchingDonors({ bloodType: userData?.bloodType });
    //             console.log(">> matching donors: ", data.donors, data.hospitals);
    //             setMatchingDonors(data.donors);
    //         } catch (error) {
    //             console.log("Error occurred while fetching matching donors: ", error.message)
    //         }
    //     }
    //     fetchMatchingDonors();
    // }, [userData])

    const handleDisplayOverlay = () => {
        dispatch(displayOverlayContainer());
    }

    return (
        <>
            <header className="bg-gray-200 py-4">
                <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Welcome, {userData?.username}!</h1>
                    {
                        !userData?.isDonor &&
                        <button
                            onClick={handleDisplayOverlay}
                            className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-full">
                            + request donation
                        </button>
                    }
                </nav>
            </header>
            {
                showOverlay && <Overlay><DonationRequestForm /></Overlay>
            }
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Blood Donation Requests</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {
                        requestList.map((data) =>
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

export default AuthRequired(Dashboard);
