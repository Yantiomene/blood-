import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/user';
import { VERIFYACCOUNT } from '../api';


const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [bloodType, setBloodType] = useState('');

    const [registerError, setRegisterError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [checkPassword, setCheckPassword] = useState(false);

    const router = useNavigate();

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value.length >= 3)
            setCheckPassword(true);
        else
            setCheckPassword(false);
    }

    const handleRegister = async (event) => {
        event.preventDefault();

        setIsLoading(true);

        if (password !== confirmPassword) {
            setRegisterError('Passwords do not match');
            return;
        }

        try {
            const user = {
                email,
                username,
                password,
                bloodType,
            };
            const response = await register(user);
            if (response) {
                router(VERIFYACCOUNT);
                return;
            } else {
                console.log(`${response}`);
            }
            setRegisterError('');
        }
        catch (error) {
            setRegisterError(`Registration failed: ${error.message}`);
            console.error('Register error:', error);
        }

        setIsLoading(false);
    };

    const inputStyles = "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";

    return (
        <>
            <form onSubmit={handleRegister} className="w-[90vw] md:w-[40vw] bg-white shadow-md rounded px-8 py-8 mb-4">
                {registerError && <p className="text-red-500 rounded p-2 block bg-red-100 mb-4">{registerError}</p>}

                <div className="mb-4">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputStyles}
                        aria-describedby="emailHelpText"
                        required={true}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={inputStyles}
                        aria-describedby="usernameHelpText"
                        required={true}
                    />
                    <small id="usernameHelpText" className="text-gray-500">Choose a unique username.</small>
                </div>

                <div className="mb-4">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputStyles}
                        aria-describedby="passwordHelpText"
                        required={true}
                    />
                    <small id="passwordHelpText" className="text-gray-500">Must be at least 8 characters long.</small>
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    {
                        checkPassword &&
                        <small className={`rounded p-2 block ${confirmPassword === password ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                            {
                                confirmPassword === password ?
                                    "Passwords do match"
                                    :
                                    "Passwords do NOT match"
                            }
                        </small>
                    }
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleConfirmPassword}
                        className={inputStyles}
                        aria-describedby="confirmPasswordHelpText"
                        required={true}
                    />
                    <small id="confirmPasswordHelpText" className="text-gray-500">
                        Please re-enter your password.
                    </small>
                </div>

                <div className="mb-4">
                    <label htmlFor="bloodType">Blood Type</label>
                    <select
                        id="bloodType"
                        value={bloodType}
                        onChange={(e) => setBloodType(e.target.value)}
                        className={inputStyles}
                        aria-describedby="bloodTypeHelpText"
                        required={true}
                    >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>

                <button
                    className={`inline-block w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? " bg-gray-500" : " bg-red-500 hover:bg-red-700"}`}
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Register'}
                </button>
                <p className="text-gray-500 text-center mt-4 text-sm">
                    Already have an account? <a className='text-red-500 hover:text-red-400' href="/login">Login</a>
                </p>
            </form>
        </>
    );
};

export default RegisterForm;
