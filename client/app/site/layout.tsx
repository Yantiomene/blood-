import React from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blood+ Site",
    description: "Learn more about who we are and what we do",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <footer className="bg-red-800 py-4">
                <div className="container mx-auto text-center text-white">
                    &copy; 2024 My Blog. All rights reserved.
                </div>
            </footer>
        </>
    );
}
