import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getDonationRequests,
    findDonationRequestByDate,
    getDonationRequestByUserId,
    findRequestByBloodType,
    findDonationRequestByLocation,
    findDonationRequestByPriority,

    makeDonationRequest,
    deleteDonationRequest,
    updateDonationRequest,
} from '../api/donation';


export const fetchDonationRequests = createAsyncThunk(
    'donationRequests/fetchRequests',
    async ({ type, userId, fromDate, toDate, bloodType, location }) => {
        try {
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
        } catch (error) {
            throw error;
        }
    }
);

export const addDonationRequest = createAsyncThunk(
    'donationRequests/addRequest',
    async (requestData) => {
        try {
            return await makeDonationRequest(requestData);
        } catch (error) {
            throw error;
        }
    }
);

export const updateRequest = createAsyncThunk(
    'donationRequests/updateRequest',
    async (requestData) => {
        try {
            return await updateDonationRequest(requestData);
        } catch (error) {
            throw error;
        }
    }
);

export const deleteRequest = createAsyncThunk(
    'donationRequests/deleteRequest',
    async (requestId) => {
        try {
            await deleteDonationRequest(requestId);
            return requestId;
        } catch (error) {
            throw error;
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
            })
            .addCase(addDonationRequest.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addDonationRequest.fulfilled, (state, action) => {
                state.data.push(action.payload.donationRequest);
                state.status = 'succeeded';
            })
            .addCase(addDonationRequest.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteRequest.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteRequest.fulfilled, (state, action) => {
                state.data = state.data.filter((request) => request.id !== action.payload);
                state.status = 'succeeded';
            })
            .addCase(deleteRequest.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateRequest.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateRequest.fulfilled, (state, action) => {
                state.data = state.data.map((request) =>
                    request.id === action.payload.donationRequest.id ? action.payload.donationRequest : request
                );
                state.status = 'succeeded';
            })
            .addCase(updateRequest.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setCurrentIndex, nextRequest, previousRequest } = donationRequestSlice.actions;
export default donationRequestSlice.reducer;
