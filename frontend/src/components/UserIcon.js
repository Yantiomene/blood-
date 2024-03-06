import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../api/user';
import { unAuthenticateUser } from '../redux/authSlice';
import { HOMEROUTE, PROFILEROUTE } from '../api';
// assets
import { profilepic } from '../assets';

const dropdownItemStyles = "px-4 py-2 hover:bg-gray-100 rounded cursor-pointer";

const UserProfileIcon = () => {
    const router = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.data);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = async () => {
        try {
            const status = await logout();
            if (status.success) {
                dispatch(unAuthenticateUser());
                router(HOMEROUTE);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

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
                <div className="absolute top-10 right-0 z-50 bg-white rounded shadow">
                    {userData && (
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
                            <li className={dropdownItemStyles + ' hover:bg-red-100'} onClick={handleLogout}>
                                Logout
                            </li>
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfileIcon;
