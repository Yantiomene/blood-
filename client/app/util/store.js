import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});


// learn more: https://redux.js.org/usage/nextjs#initial-setup