"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import NavItem from './NavItem';
import UserProfileIcon from "./UserIcon";

const Header: React.FC<{ isLoggedin: boolean }> = ({ isLoggedin }) => {
    const pathname = usePathname();

    useEffect(() => {
        localStorage.setItem('isAuth', `${isLoggedin}`);
    }, [isLoggedin]);

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
-                        {isLoggedin && <NavItem href="/dashboard/messages" isActive={pathname?.startsWith('/dashboard/messages')}>Messages</NavItem>}
+                        {isLoggedin && (
+                          <NavItem href="/dashboard/messages" isActive={pathname?.startsWith('/dashboard/messages')}>
+                            <span className="inline-flex items-center" aria-label="Messages" title="Messages">
+                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
+                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
+                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l9 6 9-6" />
+                              </svg>
+                            </span>
+                          </NavItem>
+                        )}
                        {!isLoggedin && <NavItem href="/login" isActive={pathname === '/login'}>Login</NavItem>}
                        {!isLoggedin && <NavItem href="/register" isActive={pathname === '/register'}>Register</NavItem>}
                    </ul>
                    {isLoggedin && <UserProfileIcon />}
                </nav>
            </div>
        </header>
    );
};

export default Header;
