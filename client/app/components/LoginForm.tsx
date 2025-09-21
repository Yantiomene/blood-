"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '../api/user';
import { useDispatch } from 'react-redux';
import { authenticateUser } from "../redux/authSlice";

const LoginForm: React.FC = () => {
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
    const dispatch = useDispatch();

    const handleemailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setemail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await login({ email, password });
            if (response.success) {
                dispatch(authenticateUser());
                router.push('/dashboard');
            }
        } catch (error) {
            setLoginError('Invalid email or password');
        }
    };

    const inputStyles = "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";

    return (
        <>
            <form onSubmit={handleSubmit} className="w-[90vw] md:w-[40vw] bg-white shadow-md rounded px-8 py-8 mb-4">
                {registered && <p className="text-green-600 mb-4">Registration successful. Please log in.</p>}
                {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        email:
                    </label>
                    <input
                        className={inputStyles}
                        id="email"
                        type="text"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleemailChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password:
                    </label>
                    <input
                        className={inputStyles}
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <small className="text-gray-500 italic text-sm">
                        Forgot password?
                        <a href="/forgot-password"> Click here</a>
                    </small>
                </div>
                <div className="">
                    <button
                        className="bg-red-500 inline-block w-full hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >Login
                    </button>
                    <p className="text-gray-500 text-center mt-4 text-sm">
                        Don't have an account? <a className='text-red-500 hover:text-red-400' href="/register">Register</a>
                    </p>
                </div>
            </form>
        </>
    );
};

export default LoginForm;