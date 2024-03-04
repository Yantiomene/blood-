import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticateUser: (state) => {
      console.log(">>> authenticating user from store...")
      state.isAuth = true;
      localStorage.setItem('isAuth', 'true');
    },
    unAuthenticateUser: (state) => {
      state.isAuth = false;
      localStorage.setItem('isAuth', 'false');
    },
  },
});

export const { authenticateUser, unAuthenticateUser } = authSlice.actions;

export const selectAuthStatus = (state) => state.auth.isAuth;

export default authSlice.reducer;
