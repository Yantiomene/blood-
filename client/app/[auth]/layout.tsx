import React from 'react';
import type { Metadata } from "next";

type AuthLayoutProps = {
    title: string;
    children: React.ReactNode;
};

export const metadata: Metadata = {
    title: "Blood+",
    description: "Login to your account",
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            {children}
        </div>
    );
};

export default AuthLayout;
