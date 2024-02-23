"use client";
import Link from "next/link"
import { usePathname } from 'next/navigation';
import NavItem from './NavItem';
import UserProfileIcon from "./UserIcon";

const Header: React.FC = () => {
    const pathname = usePathname();

    return (
        <header className="bg-red-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-6">                                    
                    <Link href="/" className="text-white text-2xl font-bold">
                        BloodPlus
                    </Link>

                    <ul className="md:flex space-x-4 hidden">
                        <NavItem href="/blog" isActive={pathname === '/blog'}>Blog</NavItem>
                        <NavItem href="/about" isActive={pathname === '/about'}>About</NavItem>
                        <NavItem href="/faq" isActive={pathname === '/faq'}>FAQ</NavItem>
                    </ul>
                </div>

                <nav className="flex items-center gap-6">
                    <ul className="flex space-x-4">
                        <NavItem href="/dashboard" isActive={pathname === '/dashboard'}>Dashboard</NavItem>
                        <NavItem href="/auth/login" isActive={pathname === '/auth/login'}>Login</NavItem>
                        <NavItem href="/auth/register" isActive={pathname === '/auth/register'}>Register</NavItem>
                    </ul>
                    <UserProfileIcon />
                </nav>
            </div>
        </header>
    );
};

export default Header;
