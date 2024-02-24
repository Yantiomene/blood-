"use client";

import React, { useEffect, useState } from 'react';
import { getUsers } from '../api/user';

const UserPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUsers();
                const data = response.props.data;
                setUsers(data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mx-auto">
            {users.length > 0 ? (
                <ul className="space-y-4">
                    {users.map((user) => (
                        <li key={user.id}>
                            <React.Fragment>
                                <h1 className="text-2xl font-bold">{user.username}</h1>
                                <p>Email: {user.email}</p>
                            </React.Fragment>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserPage;

interface User {
    id: number;
    username: string;
    email: string;
}
