import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../api/user';
import { useRouter } from 'next/navigation';
import { unAuthenticateUser } from '../redux/authSlice';
import { fetchCurrentUser } from '../redux/userSlice';

const dropdownItemStyles = "px-4 py-2 hover:bg-gray-100 rounded cursor-pointer";

const UserProfileIcon: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user.data);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (!user?.email) {
            dispatch(fetchCurrentUser() as any);
        }
    }, [dispatch, user?.email]);

    const initials = useMemo(() => {
        const name = user?.username || user?.email || '';
        const parts = String(name).trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        if (parts.length === 1 && parts[0]) return parts[0][0].toUpperCase();
        return 'U';
    }, [user?.username, user?.email]);

    const handleDropdownToggle = () => setIsDropdownOpen((v) => !v);

    const handleLogout = async () => {
        try {
            const status = await logout();
            if (status.success) {
                dispatch(unAuthenticateUser());
                router.push('/');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="relative select-none"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
        >
            <button
                aria-label="User menu"
                onClick={handleDropdownToggle}
                className="shrink-0 w-10 h-10 rounded-full cursor-pointer bg-white text-red-600 font-bold flex items-center justify-center border border-red-200 shadow-sm"
                title={user?.username || user?.email}
            >
                {initials}
            </button>
            {isDropdownOpen && (
                <div className="absolute top-12 right-0 z-50 bg-white rounded shadow min-w-[180px]">
                    <ul className="p-2">
                        <li className={dropdownItemStyles + ' text-nowrap'}>
                            <Link href="/profile">
                                <span className="font-medium">{user?.username || user?.email || 'Profile'}</span>
                                {user?.bloodType && (
                                    <span className='ml-2 px-1 rounded-full text-white bg-red-500 text-center text-xs'>
                                        {user.bloodType}
                                    </span>
                                )}
                            </Link>
                        </li>
                        <li className={dropdownItemStyles + ' text-nowrap'}>
                            <Link href="/preferences">Preferences</Link>
                        </li>
                        <li className={dropdownItemStyles + ' hover:bg-red-100 text-red-600'} onClick={handleLogout}>
                            Logout
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserProfileIcon;