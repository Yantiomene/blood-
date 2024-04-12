import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../redux/userSlice';
import { LOGOUTROUTE, PROFILEROUTE } from '../api';
// assets
import { profilepic } from '../assets';
import { selectUser, validateAuthStatus } from '../redux/userSlice';

const dropdownItemStyles = "px-3 py-2 hover:bg-gray-100 text-gray-800 hover:text-red-600 rounded cursor-pointer block";

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
                className="shrink-0 w-10 h-10 rounded-full cursor-pointer outline outline-transparent hover:outline-gray-300"
                src={profilepic}
                width={40}
                height={40}
                alt="Profile Icon"
            />
            {isDropdownOpen && (
                <div className="dropdown border border-gray-200 absolute top-10 right-0 z-50 bg-white rounded-md shadow">
                    {isLoggedin && (
                        <ul className="p-2">
                            <li>
                                <span className="mb-2 px-3 py-2 bg-red-100 rounded-full block text-nowrap">
                                    {userData.username}
                                    <span className='ml-2 px-1 rounded-full text-white bg-red-500 text-center text-xs'>
                                        {userData.bloodType}
                                    </span>
                                </span>
                                <hr/>
                            </li>
                            <li>
                                <Link to={PROFILEROUTE} className={dropdownItemStyles}>
                                    Settings
                                </Link>
                            </li>
                            <li>
                                <Link to={LOGOUTROUTE}
                                    className={dropdownItemStyles}
                                >Logout</Link>
                            </li>
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfileIcon;
