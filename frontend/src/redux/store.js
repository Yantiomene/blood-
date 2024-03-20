import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import userSlice from './userSlice';
import globalComponent from './globalComponentSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    globalComponent: globalComponent,
  },
});
export default store;