"use client";

import Header from "../components/Header";
import { useSelector } from 'react-redux';

export default function BlogLandingPage() {
    const auth = useSelector((state: any) => state.auth.isAuth);

    return (
        <>
        <Header isLoggedin={auth} />
        <main className="container mx-auto py-8 min-h-screen">
        
            <h1 className="text-4xl font-bold mb-4">Welcome to My Blog</h1>
            <p className="text-lg text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl id lacinia lacinia, nunc nunc tincidunt nunc, id lacinia nunc nunc id nunc.</p>
            <div className="grid grid-cols-3 gap-4 mt-8">
                {/* Render blog posts here */}
            </div>
        </main>
        <footer className="bg-red-800 py-4">
            <div className="container mx-auto text-center text-white">
                &copy; 2024 My Blog. All rights reserved.
            </div>
        </footer>
        </>
    );
};
