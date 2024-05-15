import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getDonationRequests,
    findDonationRequestByDate,
    getDonationRequestByUserId,
    findRequestByBloodType,
    findDonationRequestByLocation,
    findDonationRequestByPriority
} from '../api/donation';


export const fetchDonationRequests = createAsyncThunk(
    'donationRequests/fetchRequests',
    async ({ type, userId, fromDate, toDate, bloodType, location }) => {
        switch (type) {
            case 'all':
                return await getDonationRequests();
            case 'byDate':
                return await findDonationRequestByDate(fromDate, toDate);
            case 'byUserId':
                return await getDonationRequestByUserId(userId);
            case 'byBloodType':
                return await findRequestByBloodType(bloodType);
            case 'byLocation':
                return await findDonationRequestByLocation(location);
            case 'urgent':
                return await findDonationRequestByPriority(true);
            default:
                throw new Error('Invalid request type');
        }
    }
);


const donationRequestSlice = createSlice({
    name: 'donationRequest',
    initialState: {
        data: [],
        currentIndex: 0,
        status: 'idle',
        error: null,
    },
    reducers: {
        setCurrentIndex(state, action) {
            state.currentIndex = action.payload;
        },
        nextRequest(state) {
            state.currentIndex = (state.currentIndex + 1) % state.data.length;
        },
        previousRequest(state) {
            state.currentIndex = (state.currentIndex - 1 + state.data.length) % state.data.length;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDonationRequests.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDonationRequests.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.donationRequests || [];
            })
            .addCase(fetchDonationRequests.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});


export const { setCurrentIndex, nextRequest, previousRequest } = donationRequestSlice.actions;
export default donationRequestSlice.reducer;
