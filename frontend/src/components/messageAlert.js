import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { exitMessage } from '../redux/globalComponentSlice';

const MessageAlert = () => {
    const message = useSelector((state) => state.appMessage);
    const dispatch = useDispatch();

    if (!message.displayMessage) return;

    return (
        <div className={
            "app-message text-gray-900 " +
            `${message.heading === 'Success' ? ' success'
                : message.heading === 'Error' ? ' error'
                    : message.heading === 'Warning' ? ' warning'
                        : ''
            }`}>
            <div className='flex justify-between items-center'>
                <h3 className='text-2xl opacity-60'>{message.heading}</h3>
                <button onClick={() => dispatch(exitMessage())}
                    className='rounded-full border text-white p-1 m-2 w-8 h-8 overflow-hidden'
                >X
                </button>
            </div>
            <hr />
            <p className='py-2'>{message.text}</p>
        </div>
    )
}

export default MessageAlert;