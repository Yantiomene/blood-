import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
        if (isLoggedin && !userData) {
            dispatch(fetchCurrentUser());
        }
    }, [isLoggedin, userData, dispatch]);

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


    return (
        <div className="relative"
            onClick={handleDropdownToggle}
        >
            <img
                className="w-10 h-10 rounded-full cursor-pointer outline outline-transparent hover:outline-slate-300"
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
                                <span className="mb-2 px-3 py-2 bg-red-100 rounded-full block text-nowrap">
                                    {userData?.username || 'Loading...'}
                                    <span className='ml-2 px-1 rounded-full text-white bg-red-500 text-center text-xs'>
                                        {userData?.bloodType || '?'}
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
