"use client";

import React from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthStatus } from '@/app/redux/authSlice';
import DashboardPage from '@/app/pages/dashboard';
import AuthPage from '@/app/pages/authPage';
import BlogLandingPage from '@/app/pages/blog';
import AboutPage from '@/app/pages/about';
import FourZeroFour from '../pages/404';
import LoginForm from '@/app/components/LoginForm';
import RegisterForm from '@/app/components/RegisterForm';
import UpdateProfileForm from '@/app/components/UpdateProfileForm';
import Dashboard from '@/app/components/Dash';

const PrivateRoutes: React.FC = () => {
    // const isAuth = useSelector(selectAuthStatus);
    // return <>{isAuth ? <Outlet /> : <Navigate to="/login" />}</>;
    return <Outlet />;
};

const RestrictedRoutes: React.FC = () => {
    // const { isAuth } = useSelector(selectAuthStatus);

    // return <>{isAuth ? <Navigate to="/dashboard" /> : <Outlet />}</>;
    return <Outlet />;
};

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route element={<PrivateRoutes />}>
                    <Route path="dashboard" element={<Dashboard />} />
                </Route>

                <Route element={<RestrictedRoutes />}>
                    <Route path="login" element={<LoginForm />} />
                    <Route path="register" element={<RegisterForm />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
