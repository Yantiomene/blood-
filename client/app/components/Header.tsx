"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import NavItem from './NavItem';
import UserProfileIcon from "./UserIcon";
import { getUnreadMessageCount } from '../api/messages';
import { subscribeToUnreadUpdates, UnreadUpdate } from '../utils/websocket';

const Header: React.FC<{ isLoggedin: boolean }> = ({ isLoggedin }) => {
    const pathname = usePathname();
    const [unreadCount, setUnreadCount] = useState<number>(0);

    useEffect(() => {
        localStorage.setItem('isAuth', `${isLoggedin}`);
    }, [isLoggedin]);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | null = null;
        let unsubscribeWebSocket: (() => void) | null = null;
        
        const loadCount = async () => {
            if (!isLoggedin) { setUnreadCount(0); return; }
            try {
                const count = await getUnreadMessageCount();
                setUnreadCount(Number(count) || 0);
            } catch {
                setUnreadCount(0);
            }
        };
        
        const handleUnreadChanged = () => { loadCount(); };
        
        // WebSocket subscription for real-time updates
        const handleWebSocketUpdate = (update: UnreadUpdate) => {
            console.log('Header received unread update:', update);
            if (update.allRead) {
                setUnreadCount(0);
            } else {
                setUnreadCount(update.totalUnread || 0);
            }
        };
        
        if (typeof window !== 'undefined') {
            window.addEventListener('unreadChanged', handleUnreadChanged);
        }
        
        loadCount();
        
        if (isLoggedin) {
            // Set up WebSocket subscription for real-time updates
            unsubscribeWebSocket = subscribeToUnreadUpdates(handleWebSocketUpdate);
            
            // Keep the polling as fallback, but reduce frequency since we have real-time updates
            timer = setInterval(loadCount, 300000); // refresh every 5 minutes as fallback
        }
        
        return () => {
            if (timer) clearInterval(timer);
            if (unsubscribeWebSocket) unsubscribeWebSocket();
            if (typeof window !== 'undefined') {
                window.removeEventListener('unreadChanged', handleUnreadChanged);
            }
        };
    }, [isLoggedin, pathname]);

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
                        {isLoggedin && (
                          <NavItem href="/dashboard/messages" isActive={pathname?.startsWith('/dashboard/messages')}>
                            <span className="relative inline-flex items-center" aria-label="Messages" title="Messages">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a4 4 0 01-4 4H7l-4 4V7a4 4 0 014-4h10a4 4 0 014 4v8z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 9h10" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 13h6" />
                              </svg>
                              {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-white text-red-700 border border-red-600 rounded-full text-[10px] font-bold px-[6px] leading-5 min-w-[18px] text-center">
                                  {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                              )}
                            </span>
                          </NavItem>
                        )}
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
