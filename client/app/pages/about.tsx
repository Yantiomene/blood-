"use client";

import Header from "../components/Header";
import { useSelector } from "react-redux";

export default function AboutPage() {
    const auth = useSelector((state: any) => state.auth.isAuth);
    console.log(">> auth: ", auth);
    return (
        <>
        <Header isLoggedin={auth} />
        <main className="container mx-auto py-8 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">About Page</h1>
            <p className="text-lg">
                This is the about Page
                {/* will put information about app, developers, etc... */}
            </p>
        </main>
        </>
    );
};