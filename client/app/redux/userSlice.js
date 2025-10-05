import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentUser, updateProfile } from '../api/user';

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async () => {
    const response = await getCurrentUser();
    return response.user;
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData) => {
    const response = await updateProfile(userData);
    return response; // backend returns { success, message }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: {
      username: '',
      email: '',
      bloodType: '',
      isDonor: false,
      location: [0, 0],
      contactNumber: ''
    },
    loading: false,
    error: null,
  },
  reducers: {
    // Add other synchronous actions if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        // backend update endpoint does not return user, so do not mutate state here
        // UI should re-fetch profile after successful update
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
