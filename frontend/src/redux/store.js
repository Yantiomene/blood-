import { configureStore } from '@reduxjs/toolkit';
import authSlice, { initializeAuthStatus } from './authSlice';
import userSlice from './userSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
  },
});

store.dispatch(initializeAuthStatus());
export default store;