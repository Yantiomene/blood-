import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../redux/userSlice';
import { LOGOUTROUTE, PROFILEROUTE } from '../api';
// assets
import { profilepic } from '../assets';
import { selectUser, validateAuthStatus } from '../redux/userSlice';

const dropdownItemStyles = "px-4 py-2 hover:bg-gray-100 hover:text-red-600 rounded cursor-pointer";

const UserProfileIcon = () => {
    const dispatch = useDispatch();
    const userData = useSelector(selectUser);
    const isLoggedin = useSelector(validateAuthStatus);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        if (!isLoggedin) {
            dispatch(fetchCurrentUser());
        }
    }, [isLoggedin, dispatch]);

    return (
        <div className="relative"
            onMouseEnter={handleDropdownToggle}
            onMouseLeave={handleDropdownToggle}
            onClick={handleDropdownToggle}
        >
            <img
                className="shrink-0 w-10 h-10 rounded-full cursor-pointer"
                src={profilepic}
                width={40}
                height={40}
                alt="Profile Icon"
            />
            {isDropdownOpen && (
                <div className="dropdown absolute top-10 right-0 z-50 bg-white rounded shadow-lg">
                    {userData.username !== '' && (
                        <ul className="p-2">
                            <li className={dropdownItemStyles + ' text-nowrap'}>
                                <Link to={PROFILEROUTE}>
                                    {userData.username}
                                    <span className='ml-2 px-1 rounded-full text-white bg-red-500 text-center text-xs'>
                                        {userData.bloodType}
                                    </span>
                                </Link>
                            </li>
                            <li className={dropdownItemStyles}>Settings</li>
                            <li className={dropdownItemStyles + ' hover:bg-red-100 active:bg-red-300 active:text-red-500'}>
                                <Link to={LOGOUTROUTE}>Logout</Link>
                            </li>
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfileIcon;
