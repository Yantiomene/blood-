"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import NavItem from './NavItem';
import UserProfileIcon from "./UserIcon";
import Image from "next/image";
import { useDispatch } from 'react-redux';
import { logout } from '../api/user';
import { unAuthenticateUser } from '../redux/authSlice';

const Header: React.FC<{ isLoggedin: boolean }> = ({ isLoggedin }) => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        localStorage.setItem('isAuth', `${isLoggedin}`);
    }, [isLoggedin]);

    const handleLogout = async () => {
        try {
            const status = await logout();
            if (status?.success) {
                dispatch(unAuthenticateUser());
                router.push('/');
            }
        } catch (e) {
            console.error('Logout failed:', e);
        }
    };

    return (
        <header className="bg-red-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-white text-2xl font-bold">
                    {/* <Image src={logo} width={100} alt="blood+" /> */}
                    <div className="flex items-center gap-6">
                        Blood+
                    </div>
                </Link>

                <nav className="flex items-center gap-6">
                    <ul className="md:flex space-x-4 hidden mr-10">
                        <NavItem href="/" isActive={pathname === '/'}>Home</NavItem>
                        <NavItem href="/site/blog" isActive={pathname === '/site/blog'}>Blog</NavItem>
                        <NavItem href="/site/about" isActive={pathname === '/site/about'}>About</NavItem>
                    </ul>
                    <ul className="flex space-x-4 items-center">
                        {isLoggedin && <NavItem href="/dashboard" isActive={pathname === '/dashboard'}>Dashboard</NavItem>}
                        {!isLoggedin && <NavItem href="/login" isActive={pathname === '/login'}>Login</NavItem>}
                        {!isLoggedin && <NavItem href="/register" isActive={pathname === '/register'}>Register</NavItem>}
                        {isLoggedin && (
                            <li>
                                <button onClick={handleLogout} className="text-white hover:opacity-80">Logout</button>
                            </li>
                        )}
                    </ul>
                    {isLoggedin && <UserProfileIcon />}
                </nav>
            </div>
        </header>
    );
};

export default Header;
