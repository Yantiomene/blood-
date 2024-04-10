import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DASHBOARDROUTE, REGISTERROUTE } from '../api';
import { login } from '../api/user';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from "../redux/userSlice";
// import { authenticateUser } from "../redux/authSlice";
import { showMessage } from "../redux/globalComponentSlice";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsLoading(true); // Set isLoading to true on submit

        try {
            const response = await login({ email, password });
            if (response.success) {
                dispatch(fetchCurrentUser());
                router(DASHBOARDROUTE);
            }
        } catch (error) {
            dispatch(showMessage({heading: "Error", text: "Invalid email or password"}));
        }

        setIsLoading(false);
    };

    const inputStyles = "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";

    return (
        <>
            <form onSubmit={handleSubmit} className="w-[90vw] md:w-[40vw] bg-white shadow-md rounded px-8 py-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email:
                    </label>
                    <input
                        className={inputStyles}
                        id="email"
                        type="text"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event)=> setEmail(event.target.value)}
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
                        onChange={(event)=> setPassword(event.target.value)}
                    />
                    <small className="text-gray-500 italic text-sm">
                        Forgot password?
                        <a href="/forgot-password"> Click here</a>
                    </small>
                </div>
                <button
                    className={`inline-block w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? " bg-gray-500" : " bg-red-500 hover:bg-red-700"}`}
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Login'}
                </button>
                <p className="text-gray-500 text-center mt-4 text-sm">
                    Don't have an account? <a className='text-red-500 hover:text-red-400' href={REGISTERROUTE}>Register</a>
                </p>
            </form>
        </>
    );
};

export default LoginForm;
