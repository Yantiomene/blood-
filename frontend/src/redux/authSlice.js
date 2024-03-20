import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticateUser: (state) => {
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


// login status should not be only dependent on localstorage state value
// request the backend to truly confirm the login status
// this should be two sided: frontend (true) and backend (true)
export const selectAuthStatus = () => {
  const loginState = localStorage.getItem('isAuth');
  console.log(">> getting auth state", loginState);
  return loginState === 'true';
};

export default authSlice.reducer;
