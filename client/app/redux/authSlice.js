import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    isAuth: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticateUser: (state) => {
        state.isAuth = true
    },

    unAuthenticateUser: (state) => {
            state.isAuth = false
        },
    },
})

export const { authenticateUser, unAuthenticateUser } = authSlice.actions

export default authSlice.reducer