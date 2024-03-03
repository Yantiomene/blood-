import React from 'react';
import type { Metadata } from "next";

type AuthLayoutProps = {
    title: string;
    children: React.ReactNode;
};

export const metadata: Metadata = {
    title: "Blood+ Login",
    description: "Login to your account",
};


const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <>
            <div className="pt-[5%] flex flex-col items-center min-h-screen bg-gray-100">
                <div>{children}</div>
            </div>
        </>
    );
};

export default AuthLayout;
