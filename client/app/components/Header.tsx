"use client";
import Link from "next/link"
import { usePathname } from 'next/navigation';
import NavItem from './NavItem';
import UserProfileIcon from "./UserIcon";

const Header: React.FC = () => {
    const pathname = usePathname();

    return (
        <header className="bg-red-500 py-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-white text-2xl font-bold">
                    BloodPlus
                </Link>
                <nav className="flex items-center gap-10">
                    <ul className="flex space-x-4">
                        <NavItem href="/" isActive={pathname === '/'}>Home</NavItem>
                        <NavItem href="/auth/login" isActive={pathname === '/auth/login'}>Login</NavItem>
                        <NavItem href="/auth/register" isActive={pathname === '/auth/register'}>Register</NavItem>
                        <NavItem href="/blog" isActive={pathname === '/blog'}>Blog</NavItem>
                    </ul>
                    <UserProfileIcon />
                </nav>
            </div>
        </header>
    );
};

export default Header;
