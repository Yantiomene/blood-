import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getDonationRequest, findMatchingDonors } from '../api/donation';
import { displayOverlayContainer } from '../redux/globalComponentSlice';
// layouts
import AuthRequired from './authRequired';
// components
import Overlay from './overlayContainer';
import DonationCard from '../components/DonorCard';
import DonationRequestForm from '../components/donationRequestForm';
import Loader from '../components/loader';
import { selectUser } from '../redux/userSlice';
import NavItem from '../components/navItem';

const buttonStyle = "text-slate-600 border border-slate-300 hover:text-red-600 px-3 py-2 hover:bg-slate-200 active:bg-slate-300 rounded-md transition duration-100";
const buttonActiveStyle = "bg-slate-300";

const Dashboard = () => {
    const pathname = useLocation().search.split('=')[1];
    console.log(">> path", pathname);
    const [requestList, setRequestList] = useState([]);
    const [matchingDonors, setMatchingDonors] = useState([]);

    const dispatch = useDispatch();
    const userData = useSelector(selectUser);
    const showOverlay = useSelector((state) => state.globalComponent.displayOverlay);

    useEffect(() => {
        const fetchDonationReqeusts = async () => {
            try {
                const data = await getDonationRequest();
                setRequestList(data.donationRequests.reverse());
            } catch (error) {
                console.log("Error occurred while fetching donation requests: ", error.message)
            }
        }
        fetchDonationReqeusts();
    }, [])

    const handleDisplayOverlay = () => {
        dispatch(displayOverlayContainer());
    }

    const handleFilterMyRequests = (e) => {
        e.preventDefault();
        console.log(">> loaing your requests");
    }

    return (
        <>
            <header className="bg-slate-200 py-4">
                <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Welcome, {userData.username}!</h1>
                    {
                        !userData.isDonor &&
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
            <div className="container md:w-[60vw] md:m-auto mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Blood Donation Requests</h2>

                <nav className="flex items-center gap-6 mb-8">
                    <ul className='flex space-x-4'>
                        <NavItem
                            href={'/dashboard?q=mine'}
                            isActive={pathname === 'mine'}
                            className={buttonStyle}
                            activeStyle={buttonActiveStyle}
                            onClick={(e)=>handleFilterMyRequests(e)}
                        >my requests</NavItem>
                        <NavItem
                            href={'/dashboard?q=matches'}
                            isActive={pathname === 'matches'}
                            className={buttonStyle}
                            activeStyle={buttonActiveStyle}
                        >best matches</NavItem>
                        <NavItem
                            href={'/dashboard?q=zone'}
                            isActive={pathname === 'zone'}
                            className={buttonStyle}
                            activeStyle={buttonActiveStyle}
                        >close to me</NavItem>
                    </ul>
                </nav>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {
                        requestList ?
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
                                    userId={data.userId}
                                    message={data.message}
                                    viewsCount={data.views_count}
                                    urgent={data.urgent}
                                />
                            )
                            :
                            <Loader size="40px" /> // TODO: in case of failure, alert after timeout
                    }
                </div>

                <div className="bg-slate-200 h-[600px] my-10 p-4 rounded">
                    <h1 className="mt-20 text-5xl text-center text-slate-400 font-bold">say something</h1>
                    <Loader size="50px" />
                </div>
            </div>
        </>
    );
};

export default AuthRequired(Dashboard);
