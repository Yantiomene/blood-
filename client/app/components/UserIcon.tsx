import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCurrentUser } from '../api/user';

const UserProfileIcon: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getCurrentUser();
                console.log('>> User data:', user.props.data); // xx
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
                <div className="absolute top-10 right-0 bg-white border border-gray-300 rounded shadow">
                    {userData && (
                        <ul className="py-2">
                            <li className="p-2">{userData.username}</li>
                            <li className="px-4 py-2">Settings</li>
                            <li className="px-4 py-2">Logout</li>
                            {/* will add more menu items */}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfileIcon;