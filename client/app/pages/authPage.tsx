"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from 'react-redux';
import Header from '../components/Header';

const LinkClass = 'w-1/2 p-2 rounded-md text-center';

export default function AuthPage({ children }: { children: React.ReactNode }) {
    const params = usePathname();
    const isAuth = useSelector((state: any) => state.auth.isAuth);
    console.log(">> params from auth: ", params);
    return (
        <>
            <Header isLoggedin={isAuth} />
            <div className="pt-8 flex flex-col items-center min-h-screen bg-gray-100">
                <div>
                    {
                        (params === '/login' || params === '/register') && 
                     <>
                    <div className='w-full h-[50px] p-2 my-2 flex items-center gap-10 bg-gray-200 rounded'>
                        <Link
                            className={LinkClass + `${(params === '/login') ? ' bg-red-400' : ' bg-gray-200'}`}
                            href='/login'
                        >Login
                        </Link>
                        <Link
                            className={LinkClass + `${(params === '/register') ? ' bg-red-400' : ' bg-gray-200'}`}
                            href='/register'
                        >Register
                        </Link>
                    </div>
                    </>
                    }
                    {children}
                </div>
            </div>
        </>
    );
};
