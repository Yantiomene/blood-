import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkProtected } from '../api/user';

const initialState = {
  isAuth: false,
  isLoading: true,
};

export const initializeAuthStatus = createAsyncThunk(
  'auth/initializeAuthStatus',
  async () => {
    try {
      const response = await checkProtected();
      console.log(">> response", response);
      if (response) return true
      return false;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = Boolean(action.payload);
        localStorage.setItem('isAuth', action.payload ? 'true' : 'false');
      })
      .addCase(initializeAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        localStorage.setItem('isAuth', 'false');
      });
  },
});

export const { authenticateUser, unAuthenticateUser } = authSlice.actions;

export const selectAuthStatus = (state) => state.auth.isAuth;

export default authSlice.reducer;
