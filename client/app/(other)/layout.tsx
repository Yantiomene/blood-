import React from 'react';
import type { Metadata } from "next";
import Head from 'next/head';
import Header from '../components/Header';

type OtherLayoutProps = {
    title: string;
    children: React.ReactNode;
};

export const metadata: Metadata = {
    title: "Blood+ Site",
    description: "Learn more about who we are and what we do",
};


const OtherLayout: React.FC<OtherLayoutProps> = ({ title, children }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Header />
            <main className="container mx-auto py-8 min-h-screen">
                {children}
            </main>
            <footer className="bg-red-800 py-4">
                <div className="container mx-auto text-center text-white">
                    &copy; 2024 My Blog. All rights reserved.
                </div>
            </footer>
        </>
    );
};

export default OtherLayout;
