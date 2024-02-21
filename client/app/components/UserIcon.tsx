import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCurrentUser } from '../api/user';

const dropdownItemStyles = "px-4 py-2 hover:bg-gray-100 rounded cursor-pointer";

const UserProfileIcon: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getCurrentUser();
                setUserData(user.props.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="relative" onMouseEnter={handleDropdownToggle} onMouseLeave={handleDropdownToggle}>
            <Image
                className="w-10 h-10 rounded-full cursor-pointer"
                src="/profilepic.jpg"
                width={40}
                height={40}
                alt="Profile Icon"
            />
            {isDropdownOpen && (
                <div className="absolute top-10 right-0 z-50 bg-white rounded shadow">
                    {userData && (
                        <ul className="p-2">
                            <li className={dropdownItemStyles}>{userData.username}</li>
                            <li className={dropdownItemStyles}>Settings</li>
                            <li className={dropdownItemStyles}>Logout</li>
                            {/* will add more menu items */}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfileIcon;