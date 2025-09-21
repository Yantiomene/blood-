"use client";

import React from 'react';
import { Provider } from 'react-redux';
import store from '@/app/redux/store';
// pages
import AuthPage from '@/app/pages/authPage';
// components
import LoginForm from '@/app/components/LoginForm';
import RegisterForm from '@/app/components/RegisterForm';
import UpdateProfileForm from '@/app/components/UpdateProfileForm';
import FourZeroFour from '../pages/404';

const LoginPage = ({ params }: { params: { auth: string } }) => {
  return (
    <Provider store={store}>
      <AuthPage>
        {
          params.auth === 'register' ? <RegisterForm/> :
          params.auth === 'login' ? <LoginForm/> :
          params.auth === 'profile' ? <UpdateProfileForm/> :
          <FourZeroFour />
        }
      </AuthPage>
    </Provider>
  );
};

export default LoginPage;