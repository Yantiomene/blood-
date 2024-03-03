"use client";

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/util/store';
import LoginForm from '@/app/components/LoginForm';

const LoginPage: React.FC = () => {
    return (
        <Provider store={store}>
            <LoginForm/>
        </Provider>
    );
};

export default LoginPage;