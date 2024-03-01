import React from 'react';
import type { Metadata } from "next";
import Header from '../components/Header';
import { GetToken } from '../api/util';

type DashboardLayoutProps = {
    title: string;
    children: React.ReactNode;
};

export const metadata: Metadata = {
    title: "Blood+ Dashboard",
    description: "Get insights into your donation stats",
};


const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const isLoggedin: boolean = GetToken();
    return (
        <>
            <Header isLoggedin={isLoggedin} />
            <main className="bg-gray-100 min-h-screen">
                {children}
            </main>
        </>
    );
};

export default DashboardLayout;
