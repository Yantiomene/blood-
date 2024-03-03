"use client";

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuth: () => {
        // TODO: would need to check token expiry.
        // This may make the localStorage redundant
        if (localStorage.getItem('isAuth') !== null) {
            return localStorage.getItem('isAuth') === 'true'
        } else {
            return false
        }
    },
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authenticateUser: (state) => {
            console.log(">>> authenticating user from store...")
            state.isAuth = true
        },

        unAuthenticateUser: (state) => {
            state.isAuth = false;
            localStorage.setItem('isAuth', 'false');
        },
    },
})

export const { authenticateUser, unAuthenticateUser } = authSlice.actions
export default authSlice.reducer