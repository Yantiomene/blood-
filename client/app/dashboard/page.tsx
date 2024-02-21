import React from 'react';

const UserDashboard: React.FC = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow">
                <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
                    <h1 className="text-xl font-bold">User Dashboard</h1>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                        Logout
                    </button>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Welcome, John Doe!</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 shadow rounded">
                        <h3 className="text-lg font-bold mb-2">Profile</h3>
                        <p>Email: john.doe@example.com</p>
                        <p>Username: johndoe</p>
                    </div>

                    <div className="bg-white p-4 shadow rounded">
                        <h3 className="text-lg font-bold mb-2">Orders</h3>
                        <p>Total Orders: 10</p>
                        <p>Pending Orders: 2</p>
                    </div>

                    <div className="bg-white p-4 shadow rounded">
                        <h3 className="text-lg font-bold mb-2">Settings</h3>
                        <p>Notifications: On</p>
                        <p>Language: English</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;