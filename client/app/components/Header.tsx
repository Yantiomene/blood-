"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import NavItem from './NavItem';
import UserProfileIcon from "./UserIcon";
import logo from "@/public/logo.png";

const Header: React.FC = () => {
    const pathname = usePathname();

    const isLoggedin = localStorage.getItem('isAuth') || false;

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
                        <NavItem href="/blog" isActive={pathname === '/blog'}>Blog</NavItem>
                        <NavItem href="/about" isActive={pathname === '/about'}>About</NavItem>
                        <NavItem href="/faq" isActive={pathname === '/faq'}>FAQ</NavItem>
                    </ul>
                    <ul className="flex space-x-4">
                        {isLoggedin && <NavItem href="/dashboard" isActive={pathname === '/dashboard'}>Dashboard</NavItem>}
                        {!isLoggedin && <NavItem href="/auth/login" isActive={pathname === '/auth/login'}>Login</NavItem>}
                        {!isLoggedin && <NavItem href="/auth/register" isActive={pathname === '/auth/register'}>Register</NavItem>}
                    </ul>
                    {isLoggedin && <UserProfileIcon />}
                </nav>
            </div>
        </header>
    );
};

export default Header;
