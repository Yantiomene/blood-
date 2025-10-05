import React from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blood+",
    description: "Login to your account",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100">
            {children}
        </div>
    );
}
