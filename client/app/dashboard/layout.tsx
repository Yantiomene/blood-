import React from 'react';
import type { Metadata } from "next";
import Head from 'next/head';
import Header from '../components/Header';

type DashboardLayoutProps = {
    title: string;
    children: React.ReactNode;
};

export const metadata: Metadata = {
    title: "Blood+ Dashboard",
    description: "Get insights into your donation stats",
};


const DashboardLayout: React.FC<DashboardLayoutProps> = ({ title, children }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Header />
            <main className="bg-gray-100 min-h-screen">
                {children}
            </main>
        </>
    );
};

export default DashboardLayout;
