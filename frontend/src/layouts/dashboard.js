import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DASHBOARDROUTE } from '../api';
import { getDateFromToday } from '../util/datetime';
// redux
import { useSelector } from 'react-redux';
import { findDonationRequestByLocation, findRequestByBloodType, getDonationRequests, getDonationRequestByUserId, findDonationRequestByDate, findDonationRequestByPriority } from '../api/donation';
import { showMessage } from '../redux/globalComponentSlice';
// layouts
import AuthRequired from './authRequired';
// components
import Overlay from './overlayContainer';
import DonationCard from '../components/DonorCard';
import DonationRequestForm from '../components/donationRequestForm';
import Loader from '../components/loader';
import { selectUser } from '../redux/userSlice';
import NavItem from '../components/navItem';

const buttonStyle = "block text-slate-600 border border-slate-300 hover:text-red-600 px-3 py-2 hover:bg-slate-200 active:bg-slate-300 rounded-md transition duration-100";
const buttonActiveStyle = "bg-slate-300";

const DateFilterItems = [
    {
        title: 'today',
        href: '?days=1',
    },
    {
        title: 'last week',
        href: '?days=7',
    },
    {
        title: 'last month',
        href: '?days=30'
    },
]

const Dashboard = () => {
    const query = useLocation().search;
    const queryKey = query.split('=')[0];
    const queryValue = query.split('=')[1];
    const [requestList, setRequestList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateRequest, setShowCreateRequest] = useState(false);
    const [showDateFilterList, setShowDateFilterList] = useState(false);

    const userData = useSelector(selectUser);

    const filterItems = [
        {
            title: 'my requests',
            href: '?q=mine',
            accessible: !userData.isDonor,
        },
        {
            title: 'best matches',
            href: '?q=matches',
            accessible: userData.isDonor,
        },
        {
            title: 'close to me',
            href: '?q=zone',
            accessible: userData.isDonor,
        },
        {
            title: 'very urgent',
            href: '?q=urgent',
            accessible: userData.isDonor,
        },
    ]


    useEffect(() => {
        const handleFilterMyRequests = async () => {
            let data = { donationRequests: [] };
            console.log("queryKey", queryKey);
            console.log("queryValue", queryValue);
            setIsLoading(true);

            try {
                if (queryKey && queryValue) {
                    if (queryKey === '?days') {
                        const days = parseInt(queryValue);
                        console.log("days", days);
                        data = await findDonationRequestByDate(getDateFromToday(days), getDateFromToday(0));
                    }
                    else if (queryKey === '?q') {
                        switch (queryValue) {
                            case 'mine':
                                data = await getDonationRequestByUserId(userData.id);
                                break;
                            case 'matches':
                                data = await findRequestByBloodType();
                                break;
                            case 'zone':
                                data = await findDonationRequestByLocation(userData.location);
                                break;
                            case 'urgent':
                                data = await findDonationRequestByPriority(true);
                                break;
                            default:
                                data = await getDonationRequests();
                                break;
                        }
                    }
                } else {
                    data = await getDonationRequests();
                }
                setRequestList(data.donationRequests.reverse());
                setIsLoading(false);

            } catch (error) {
                showMessage({ heading: 'Error', text: `${error.error}` })
            }
        }
        handleFilterMyRequests();
    }, [queryKey, queryValue, userData.id, userData.location]);

    return (
        <>
            <header className="bg-slate-200 py-4">
                <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Welcome, {userData.username}!</h1>
                    {
                        !userData.isDonor &&
                        <button
                            onClick={() => setShowCreateRequest(true)}
                            className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-full">
                            + request donation
                        </button>
                    }
                </nav>
            </header>
            {
                showCreateRequest && <Overlay showWindow={setShowCreateRequest}><DonationRequestForm /></Overlay>
            }
            <div className="container md:w-[60vw] md:m-auto mx-auto px-4 py-8">
                <nav className="flex justify-between items-center relative">
                    <ul className='flex flex-wrap gap-x-2 gap-y-4'>
                        <NavItem
                            href={DASHBOARDROUTE}
                            isActive={!query}
                            className={buttonStyle}
                            activeStyle={buttonActiveStyle}
                        >View All</NavItem>
                        {
                            filterItems.map((item, index) => (
                                item.accessible &&
                                <NavItem
                                    key={index}
                                    href={`${DASHBOARDROUTE}${item.href}`}
                                    isActive={query === item.href}
                                    className={buttonStyle}
                                    activeStyle={buttonActiveStyle}
                                >{item.title}</NavItem>
                            ))
                        }
                    </ul>
                    <ul className='flex flex-col w-fit bg-white overflow-hidden rounded-md shadow-md absolute top-0 right-0'>
                        <span
                            className="text-slate-600 px-3 py-2 cursor-pointer"
                            onClick={() => setShowDateFilterList(!showDateFilterList)}
                        >Filter by date {showDateFilterList ? '↓' : '↑'}</span>
                        {
                            showDateFilterList &&
                            <div className='bg-white p-2 flex flex-col border-t border-t-slate-200'>
                                {
                                    DateFilterItems.map((item, index) => (
                                        <NavItem
                                            key={index}
                                            href={`${DASHBOARDROUTE}${item.href}`}
                                            isActive={query === item.href}
                                            className='block hover:bg-slate-200 px-3 py-2 rounded-md transition duration-100 cursor-pointer text-slate-600'
                                            activeStyle={buttonActiveStyle}
                                        >{item.title}</NavItem>
                                    ))
                                }
                            </div>
                        }
                    </ul>
                </nav>
                <small className="text-sm italic text-gray-400 ">Displaying ({`${requestList.length}`}) blood donation requests </small>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                    {
                        isLoading ?
                            <Loader size="40px" />
                            :
                            requestList.length === 0 ?
                                <div>empty</div>
                                :
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
                                        editable={data.userId === userData.id}
                                    />
                                )
                    }
                </div>

                <div className="bg-slate-200 h-[600px] my-10 p-4 rounded">
                    <h1 className="mt-20 text-5xl text-center text-slate-400 font-bold">say something</h1>
                    {/* <Loader size="50px" /> */}
                </div>
            </div>
        </>
    );
};

export default AuthRequired(Dashboard);
