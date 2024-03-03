"use client";

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/redux/store'
import Dashboard from '../components/Dash';

const UserDashboard: React.FC = () => {

    return (
        <>
        <Provider store={store}>
            <Dashboard/>
        </Provider>
        </>
    );
};

export default UserDashboard;