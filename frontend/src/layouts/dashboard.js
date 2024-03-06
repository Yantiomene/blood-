import React, { useState, useEffect } from 'react';
// redux
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';
import { getDonationRequest } from '../api/donation';
// layouts
import withCurrentUser from './withCurrentUser';
// components
import Overlay from './overlayContainer';
import DonationCard from '../components/DonorCard';

const Dashboard = () => {

    const userData = useSelector(selectUser);
    const [requestList, setRequestList] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);

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

    const handleDisplayOverlay = () => {
        setShowOverlay(!showOverlay);
        const bodyElem = document.querySelector('body');
        // console.log("body element", bodyElem);
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
            <header className="bg-white sticky top-0 z-40 shadow">
                <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Welcome, {userData?.username}!</h1>
                    {
                        userData?.isDonor &&
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

// export default Dashboard;
export default withCurrentUser(Dashboard);
