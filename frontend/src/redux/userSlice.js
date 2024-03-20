import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentUser, updateProfile } from '../api/user';
import { convertGeoToPoint } from '../util/geo';

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async () => {
    console.log(">> fetching current user from store...");
    const response = await getCurrentUser();
    console.log(">> after fetching currrent user", response.user);

    if (response.user) {
        response.user.location = convertGeoToPoint(response.user.location);
        console.log(">> after process user", response.user);
    } else {
        console.log(">> after fetching current user ERROR", response.user);
    }

    return response.user;
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData) => {
    const response = await updateProfile(userData);
    return response.user;
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
      contactNumber: '',
      isVerified: false,
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
        state.data = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectUser = (state) => state.user.data;
export default userSlice.reducer;
