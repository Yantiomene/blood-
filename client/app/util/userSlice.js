"use client";

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, getCurrentUser } from '../api/user';

const initialState = {
  isLogin: false,
  data: {},
  isLoading: false,
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      if (response.success) {
        window.location.href = '/dashboard';
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCurrentUserStatus = createAsyncThunk(
  'user/getCurrentUserStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLogin = true;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Login error:', action.payload);
      })
      .addCase(getCurrentUserStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLogin = true;
        state.data = action.payload;
      })
      .addCase(getCurrentUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Get current user status error:', action.payload);
      });
  },
});

export default userReducer.reducer;
