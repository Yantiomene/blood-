import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { exitMessage } from '../redux/globalComponentSlice';

const COUNTDOWN = 5;
const SPEED = 100;
const MessageAlert = () => {
    const message = useSelector((state) => state.appMessage);
    const dispatch = useDispatch();
    const [timeLeft, setTimeLeft] = useState(COUNTDOWN);

    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch(exitMessage());
        }, timeLeft * 1000);
        return () => clearTimeout(timeout);
    }, [timeLeft, dispatch]);

    useEffect(() => {
        if (message.displayMessage) {
            setTimeLeft(COUNTDOWN);
        }
    }, [message.displayMessage]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prevTimeLeft => Math.max(prevTimeLeft - 1/SPEED, 0));
        }, SPEED/10);
        return () => clearInterval(interval);
    }, []);

    if (!message.displayMessage) return null;

    const alertClasses = `app-message text-gray-900 shadow-lg ${message.heading === 'Success' ? 'success' :
        message.heading === 'Error' ? 'error' :
            message.heading === 'Warning' ? 'warning' :
                ''
        }`;

    const progressWidth = `${(timeLeft / COUNTDOWN) * 100}%`; // Calculate width based on timeLeft

    return (
        <div className={alertClasses}>
            <div className='flex justify-between items-center'>
                <h3 className='text-2xl opacity-60'>{message.heading}</h3>
                <button
                    onClick={() => dispatch(exitMessage())}
                    className='rounded-full border text-white p-1 m-2 w-8 h-8 overflow-hidden'
                >
                    X
                </button>
            </div>
            <hr />
            <p className='py-2'>{message.text}</p>
            <div className="relative w-full bg-gray-200 h-1">
                <div 
                className="absolute top-0 bg-blue-500 h-full rounded-full transition-width"
                style={{ width: progressWidth, transition: `width ${SPEED}ms ease-in-out` }}></div>
            </div>
        </div>
    );
};

export default MessageAlert;
