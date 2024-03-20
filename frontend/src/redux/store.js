import { configureStore } from '@reduxjs/toolkit';
import authSlice, { initializeAuthStatus } from './authSlice';
import userSlice from './userSlice';
import globalComponent from './globalComponentSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    globalComponent: globalComponent,
  },
});

store.dispatch(initializeAuthStatus());
export default store;