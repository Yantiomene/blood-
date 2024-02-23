import React from 'react';
import Head from 'next/head';

type AuthLayoutProps = {
    title: string;
    children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="auth-layout flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="auth-layout__content">{children}</div>
            </div>
        </>
    );
};

export default AuthLayout;
