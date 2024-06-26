import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentUser, updateProfile } from '../api/user';
import { convertGeoToPoint } from '../util/geo';

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async () => {
    const response = await getCurrentUser();
    if (response.user) {
      response.user.location = convertGeoToPoint(response.user.location);
    }
    return response.user;
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData) => {
    const response = await updateProfile(userData);
    return response;
  }
);

const anonymousUser = {
  username: '',
  email: '',
  bloodType: '',
  isDonor: false,
  isVerified: false,
  location: [0, 0],
  contactNumber: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: anonymousUser,
    authStatus: false,
    sessionExpireDate: null,
    loading: false,
    error: null,
  },
  reducers: {
    unAuthenticateUser: (state) => {
      state.authStatus = false;
      state.data = anonymousUser;
      console.log(">> unauthenticating current user");
    },
    setSessionExpireDate: (state, action) => {
      state.sessionExpireDate = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authStatus = true;
        state.data = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.authStatus = false;
        state.error = action.error.message;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.authStatus = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectUser = (state) => state.user.data;
export const validateAuthStatus = (state) => state.user.authStatus;
export const { unAuthenticateUser, setSessionExpireDate } = userSlice.actions;
export default userSlice.reducer;
