"use client";

import React from 'react';
import Link from 'next/link';
import { Provider } from 'react-redux';
import { store } from '@/app/util/store';
import LoginForm from '@/app/components/LoginForm';
import RegisterForm from '@/app/components/RegisterForm';

const LoginPage = ({ params }: { params: { auth: string } }) => {

    const LinkClass = 'w-1/2 p-2 rounded-md text-center';

    return (
        <Provider store={store}>
            <h1 className="p-4 text-4xl text-center text-red-500 font-bold"><Link href='/'>Blood+</Link></h1>
            <div className='w-full h-[50px] p-2 flex items-center gap-10 bg-gray-200 rounded'>
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
            {
                (params.auth === 'register') ? <RegisterForm /> : <LoginForm />
            }
        </Provider>
    );
};

export default LoginPage;