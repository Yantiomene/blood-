import { createSlice } from '@reduxjs/toolkit';

const appMessageInitial = {
    displayMessage: false,
    heading: null,
    text: null,
};

export const appMessage = createSlice({
    name: 'appMessage',
    initialState: appMessageInitial,
    reducers: {
        showMessage: (state, action) => {
            state.displayMessage = true;
            console.log(">>action", action.payload)
            state.heading = action.payload.heading;
            state.text = action.payload.text;
            console.log("after action", state.heading, state.text);
        },
        exitMessage: (state) => {
            state.displayMessage = false;
        }
    }
});


export const {
    showMessage,
    exitMessage
} = appMessage.actions;

export const appMessageReducer = appMessage.reducer;
