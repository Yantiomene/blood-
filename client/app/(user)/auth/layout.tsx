import React from 'react';
import type { Metadata } from "next";
import Head from 'next/head';

type AuthLayoutProps = {
    title: string;
    children: React.ReactNode;
};

export const metadata: Metadata = {
    title: "Blood+ Login",
    description: "Login to your account",
  };
  

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div>{children}</div>
            </div>
        </>
    );
};

export default AuthLayout;
