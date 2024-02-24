"use client";

import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
import { getCurrentUser } from '../../api/user';

const ProfilePage: React.FC = () => {
    // const router = useRouter();

    const isLoggedin = localStorage.getItem('isAuth') || false;

    if (!isLoggedin) {
        window.location.href = '/auth/login';
    }

    const [userData, setUserData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCurrentUser();
                setUserData(data.user);
            } catch (error) {
                setError('Failed to fetch user profile');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mx-auto mt-8">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="bg-red-500 text-white p-8 rounded shadow">
                    <h1 className="text-2xl font-bold mb-4">User Profile</h1>
                    <p><span className="font-bold">Username:</span> {userData.username}</p>
                    <p><span className="font-bold">Email:</span> {userData.email}</p>
                    <p><span className="font-bold">Blood Type:</span> {userData.bloodType}</p>
                    <p><span className="font-bold">Location:</span> {userData.location}</p>
                    <p><span className="font-bold">Verified:</span> {userData.isVerified ? 'Yes' : 'No'}</p>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
