import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import userSlice from './userSlice';
import { globalComponentReducer, appMessageReducer } from './globalComponentSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    globalComponent: globalComponentReducer,
    appMessage: appMessageReducer,
  },
});
export default store;