import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkProtected } from '../api/user';

const initialState = {
  isAuth: false,
  isLoading: false,
};

export const initializeAuthStatus = createAsyncThunk(
  'auth/initializeAuthStatus',
  async () => {
    try {
      const response = await checkProtected();
      console.log(">> response", response);
      if (response) return true
    } catch (error) {
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
        state.isAuth = action.payload;
        localStorage.setItem('isAuth', 'true');
      })
      .addCase(initializeAuthStatus.rejected, (state) => {
        state.isLoading = false;
        // Handle error if necessary
      });
  },
});

export const { authenticateUser, unAuthenticateUser } = authSlice.actions;

export const selectAuthStatus = (state) => {
  const loginState = localStorage.getItem('isAuth');
  console.log(">> getting auth state", loginState); //state.auth.isAuth);
  return loginState === 'true'; //state.auth.isAuth;
};

export default authSlice.reducer;
