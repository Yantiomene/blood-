"use client";

import Header from "../components/Header";
import { useSelector } from 'react-redux';
import { selectAuthStatus } from "../../../frontend/src/redux/authSlice";

export default function DashboardPage({ children }: { children: React.ReactNode }) {
    const auth = useSelector(selectAuthStatus);

    return (
        <>
            <Header isLoggedin={auth} />
            <main className="bg-gray-100 min-h-screen">
                {children}
            </main>
        </>
    );
};
