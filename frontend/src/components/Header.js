import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import clsx from 'clsx';

// routes
import {
    BLOGROUTE,
    ABOUTROUTE,
    DASHBOARDROUTE,
    LOGINROUTE,
    REGISTERROUTE,
} from "../api";
// redux
import { useSelector } from "react-redux";
import { validateAuthStatus } from "../redux/userSlice";
// components
import NavItem from './navItem';
import UserProfileIcon from "./userIcon";
import Logo from "./logo";

const Header = () => {
    const pathname = useLocation().pathname;
    const isLoggedin = useSelector(validateAuthStatus);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={clsx(
            "bg-white p-2 sticky top-0 w-full z-40 transition-all duration-300", {
            'shadow': isScrolled,
            'shadow-none': !isScrolled
        }
        )}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Logo />

                <nav className="flex items-center gap-6">
                    <ul className="md:flex space-x-4 hidden mr-10">
                        <NavItem href={BLOGROUTE} isActive={pathname === BLOGROUTE}>Blog</NavItem>
                        <NavItem href={ABOUTROUTE} isActive={pathname === ABOUTROUTE}>About</NavItem>
                    </ul>
                    <ul className="flex space-x-4">
                        {isLoggedin && <NavItem href={DASHBOARDROUTE} isActive={pathname === DASHBOARDROUTE}>Dashboard</NavItem>}
                        {!isLoggedin && <NavItem href={LOGINROUTE} isActive={pathname === LOGINROUTE}>Login</NavItem>}
                        {!isLoggedin && <NavItem href={REGISTERROUTE} isActive={pathname === REGISTERROUTE}>Join</NavItem>}
                    </ul>
                    {isLoggedin && <UserProfileIcon />}
                </nav>
            </div>
        </header>
    );
};

export default Header;
