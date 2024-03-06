"use client";

import React from 'react';
import Link from 'next/link';
import { Provider } from 'react-redux';
import store from '@/app/redux/store';
// pages
import AuthPage from '@/app/pages/authPage';
// components
import LoginForm from '@/app/components/LoginForm';
import RegisterForm from '@/app/components/RegisterForm';
import UpdateProfileForm from '@/app/components/UpdateProfileForm';
import FourZeroFour from '../pages/404';

const LinkClass = 'w-1/2 p-2 rounded-md text-center';

const LoginPage = ({ params }: { params: { auth: string } }) => {

    console.log(">> params: ", params.auth)

    return (
        <Provider store={store}>
            {
                (params.auth === 'register' || params.auth === 'login') &&
            (<>
            <h1 className="p-4 text-4xl text-center text-red-500 font-bold"><Link href='/'>Blood+</Link></h1>
            <div className='w-full h-[50px] p-2 my-2 flex items-center gap-10 bg-gray-200 rounded'>
                <Link
                    className={LinkClass + `${(params.auth === 'login') ? ' bg-red-400' : ' bg-gray-200'}`}
                    href='/login'
                >Login
                </Link>
                <Link
                    className={LinkClass + `${(params.auth === 'register') ? ' bg-red-400' : ' bg-gray-200'}`}
                    href='/register'
                >Register
                </Link>
            </div>
            </>)

            }
            {
                (params.auth === 'register')? <AuthPage><RegisterForm/></AuthPage>:
                (params.auth === 'login')? <AuthPage><LoginForm/></AuthPage> :
                (params.auth === 'profile')? <AuthPage><UpdateProfileForm/></AuthPage> : 
                
                <FourZeroFour/>
            }
        </Provider>
    );
};

export default LoginPage;