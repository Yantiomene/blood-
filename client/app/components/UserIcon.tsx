import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCurrentUser, logout } from '../api/user';

const dropdownItemStyles = "px-4 py-2 hover:bg-gray-100 rounded cursor-pointer";

const UserProfileIcon: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getCurrentUser();
                setUserData(data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = async () => {
        try {
            const status = await logout();
            console.log('>> Logout status:', status);
            if (status.success) {
                localStorage.removeItem('isAuth');
                window.location.href = '/';
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
            <Image
                className="shrink-0 w-10 h-10 rounded-full cursor-pointer"
                src="/profilepic.jpg"
                width={40}
                height={40}
                alt="Profile Icon"
            />
            {isDropdownOpen && (
                <div className="absolute top-10 right-0 z-50 bg-white rounded shadow">
                    {userData && (
                        <ul className="p-2">
                            <li className={dropdownItemStyles + ' text-nowrap'}>
                                <Link href="/user">
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