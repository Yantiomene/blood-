"use client";

import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../api/user';

const UserDashboard: React.FC = () => {

    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getCurrentUser();
                setUserData(data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white sticky top-0 z-40 shadow">
                <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
                    <h1 className="text-xl font-bold">User Dashboard</h1>
                    <button className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded">
                        + action
                    </button>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Welcome, {userData?.username}!</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 shadow rounded">
                        <h3 className="text-lg font-bold mb-2">Profile</h3>
                        <p>Email: {userData?.email}</p>
                        <p>Username: {userData?.username}</p>
                    </div>

                    <div className="bg-white p-4 shadow rounded">
                        <h3 className="text-lg font-bold mb-2">Blood Requests</h3>
                        <p>Total Orders: 10</p>
                        <p>Pending Orders: 2</p>
                    </div>

                    <div className="bg-white p-4 shadow rounded">
                        <h3 className="text-lg font-bold mb-2">Settings</h3>
                        <p>Notifications: On</p>
                        <p>Language: English</p>
                    </div>
                </div>

                <div className="bg-gray-200 h-[600px] my-10 p-4 rounded">
                    <h1 className="mt-20 text-5xl text-center text-gray-400 font-bold">say something</h1>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;