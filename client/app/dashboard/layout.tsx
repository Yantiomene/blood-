import React from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blood+ Dashboard",
    description: "Get insights into your donation stats",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="bg-gray-100 min-h-screen">
            {children}
        </main>
    );
}
