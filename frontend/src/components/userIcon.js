import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../redux/userSlice';
import { LOGOUTROUTE, PROFILEROUTE } from '../api';
// assets
import { profilepic } from '../assets';
import { selectUser, validateAuthStatus } from '../redux/userSlice';

const dropdownItemStyles = "px-3 py-2 hover:bg-slate-100 text-slate-800 hover:text-red-600 rounded cursor-pointer block";

const UserProfileIcon = () => {
    const dispatch = useDispatch();
    const userData = useSelector(selectUser);
    const isLoggedin = useSelector(validateAuthStatus);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const ref = useRef(null);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        if (!isLoggedin) {
            dispatch(fetchCurrentUser());
        }
    }, [isLoggedin, dispatch]);

    const handleClickAway = (event) => {
        if (ref.current && !ref.current.contains(event.target))
            setIsDropdownOpen(false);
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickAway);
        return () => {
            document.removeEventListener('mousedown', handleClickAway);
        }
    }, []);

    const profilePictureClasses = clsx('w-10 h-10 rounded-full cursor-pointer outline outline-transparent', {
        ' hover:outline-green-300': userData.isDonor,
        'hover:outline-red-300': !userData.isDonor,
    });

    return (
        <div className="relative" onClick={handleDropdownToggle}>
            <img
                className={profilePictureClasses}
                src={profilepic}
                width={40}
                height={40}
                alt="Profile Icon"
            />
            {isDropdownOpen && (
                <div className="dropdown border border-slate-200 absolute top-14 right-0 z-50 bg-white rounded-md shadow">
                    <div className="absolute h-4 w-4 -top-2 right-3 rounded-tl bg-white border-t border-l border-slate-200 transform rotate-45"></div>
                    {isLoggedin && (
                        <ul ref={ref} className="p-2 relative">
                            <li>
                                <span className={clsx("mb-2 px-3 py-2 rounded-full block text-nowrap", {
                                    'text-green-600 bg-green-100 ': userData.isDonor,
                                    'text-red-600 bg-red-100 ': !userData.isDonor,
                                })}>
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
                                <Link to={LOGOUTROUTE} className={dropdownItemStyles}>
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfileIcon;
